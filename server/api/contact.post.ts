import nodemailer from 'nodemailer'

/**
 * Formularz kontaktowy ze strony (web/server/api/kontakt.post.ts robi
 * same-origin proxy). Wysyła wiadomość mailem przez SMTP skrzynki stowarzyszenia
 * (runtimeConfig.contactMail, env NUXT_CONTACT_MAIL_*). Nic nie zapisuje w bazie.
 * Dane użytkownika trafiają do nagłówków tylko jako Reply-To i temat.
 */

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5
// Sufit wysłanych maili na cały formularz: endpoint jest publiczny (Cloudflare Tunnel),
// a IP bierzemy z X-Forwarded-For, który bezpośredni klient może podrobić — zmiana
// nagłówka przy każdym żądaniu omija limit per IP. Liczone są tylko poprawne
// wiadomości, więc śmieciowe żądania nie blokują formularza innym.
const SEND_LIMIT_MAX = 30
const hits = new Map<string, { count: number; resetAt: number }>()
let sends = { count: 0, resetAt: 0 }

function isRateLimited(ip: string) {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    // Mapa nie może rosnąć bez końca (podrabiane X-Forwarded-For): najpierw sprzątamy
    // wygasłe wpisy, a gdy to nie wystarcza — zaczynamy od zera (sufit wysyłek nadal działa).
    if (hits.size >= 1000) {
      for (const [key, old] of hits) if (now > old.resetAt) hits.delete(key)
      if (hits.size >= 1000) hits.clear()
    }
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

function isSendLimitReached() {
  const now = Date.now()
  if (now > sends.resetAt) sends = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS }
  return ++sends.count > SEND_LIMIT_MAX
}

// Formularz to ~5 KB tekstu; większe ciało odrzucamy, zanim zostanie wczytane do pamięci.
const MAX_BODY_BYTES = 32 * 1024

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function field(body: Record<string, unknown> | null | undefined, key: string, max: number) {
  const value = body?.[key]
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) return null
  return trimmed
}

export default defineEventHandler(async (event) => {
  if (Number(getRequestHeader(event, 'content-length') ?? 0) > MAX_BODY_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Payload too large' })
  }
  const body = await readBody<Record<string, unknown> | null>(event)

  if (typeof body?.website === 'string' && body.website.trim()) {
    return { ok: true }
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (isRateLimited(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many messages — try again later' })
  }

  const name = field(body, 'name', 120)
  const email = field(body, 'email', 200)
  const message = field(body, 'message', 5000)
  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid form data' })
  }

  const { contactMail } = useRuntimeConfig()
  const host = String(contactMail.smtpHost ?? '')
  const user = String(contactMail.smtpUser ?? '')
  const pass = String(contactMail.smtpPass ?? '')
  if (!host || !user || !pass) {
    throw createError({ statusCode: 503, statusMessage: 'Contact form is not configured' })
  }
  const port = Number(contactMail.smtpPort) || 587
  if (isSendLimitReached()) {
    throw createError({ statusCode: 429, statusMessage: 'Too many messages — try again later' })
  }
  // Imię trafia do tematu i pierwszej linii treści — zawsze jako jedna linia.
  const senderName = name.replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, ' ')

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    // STARTTLS wymagany na 587; inne porty (np. lokalny sink na 1025 w testach) bez wymuszania.
    requireTLS: port === 587,
    auth: { user, pass },
    // Domyślne limity nodemailera (2 min / 30 s / 10 min) są dłuższe niż czas życia
    // funkcji Vercel, która proxuje formularz — wtedy użytkownik dostałby błąd,
    // a mail mógłby wyjść mimo to (i drugi raz po ponownym kliknięciu).
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  })

  try {
    await transport.sendMail({
      from: { name: 'Formularz nowoczesnebieszczady.com', address: String(contactMail.from || user) },
      to: String(contactMail.to),
      replyTo: email,
      subject: `Formularz kontaktowy: ${senderName}`,
      text: `Imię i nazwisko: ${senderName}\nE-mail: ${email}\n\nWiadomość:\n${message}\n`,
    })
  } catch (error) {
    console.error('[contact] SMTP send failed:', error instanceof Error ? error.message : error)
    throw createError({ statusCode: 502, statusMessage: 'Message could not be sent' })
  }

  return { ok: true }
})
