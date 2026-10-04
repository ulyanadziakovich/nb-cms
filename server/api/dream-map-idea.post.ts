import { query } from '#pruvious/server'

/**
 * Publiczny endpoint formularza „Zgłoś swój pomysł” (Mapa Marzeń). Zapisuje
 * zgłoszenie w kolekcji `dream-map-ideas` i — jeśli skonfigurowano wysyłkę —
 * wysyła powiadomienie e-mailem przez API Resend. Bez zmiennych środowiskowych
 * IDEAS_MAIL_TO i RESEND_API_KEY zgłoszenia są tylko zapisywane w panelu.
 *
 * Ochrona przed spamem: limit zgłoszeń na IP, ukryte pole-pułapka (`website`)
 * i limity długości pól.
 */

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5
const hits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

const LIMITS = { title: 150, problem: 3000, solution: 3000, contact: 200 } as const

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

async function sendNotification(idea: Record<keyof typeof LIMITS, string>) {
  const to = process.env.IDEAS_MAIL_TO
  const apiKey = process.env.RESEND_API_KEY
  if (!to || !apiKey) return
  const from = process.env.IDEAS_MAIL_FROM || 'Mapa Marzeń <onboarding@resend.dev>'
  const row = (label: string, value: string) =>
    `<p><strong>${label}</strong><br>${escapeHtml(value).replace(/\n/g, '<br>')}</p>`
  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: {
        from,
        to: to.split(',').map((s) => s.trim()),
        subject: `Nowy pomysł na Mapie Marzeń: ${idea.title}`,
        html:
          row('Tytuł pomysłu', idea.title) +
          row('Opis problemu do rozwiązania', idea.problem) +
          row('Propozycja rozwiązania / pomysł', idea.solution) +
          row('Kontakt', idea.contact),
      },
    })
  } catch (error) {
    // Zgłoszenie jest już zapisane w panelu — brak maila nie może go zgubić.
    console.error('[dream-map-idea] wysyłka e-maila nie powiodła się', error)
  }
}

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (isRateLimited(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many submissions — try again later' })
  }

  const body = await readBody(event)
  // Pole-pułapka: ludzie go nie widzą, boty zwykle je wypełniają.
  if (typeof body?.website === 'string' && body.website.trim()) {
    return { ok: true }
  }

  const idea = {
    title: clean(body?.title, LIMITS.title),
    problem: clean(body?.problem, LIMITS.problem),
    solution: clean(body?.solution, LIMITS.solution),
    contact: clean(body?.contact, LIMITS.contact),
  }
  if (!idea.title || !idea.problem || !idea.solution || !idea.contact) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }

  const result = await query('dream-map-ideas').create(idea)
  if (!result.success) {
    throw createError({ statusCode: 500, statusMessage: 'Could not save the idea' })
  }

  await sendNotification(idea)
  return { ok: true }
})
