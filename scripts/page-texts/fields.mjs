// Pomocnicze „klocki” do opisu pól w spec.mjs — każde pole to etykieta po polsku,
// podpowiedź (gdzie to jest na stronie) i obecny tekst jako wartość domyślna.
export const text = (label, def = '', hint) => ({ kind: 'text', label, default: def, hint })
export const area = (label, def = '', hint, rows = 3) => ({ kind: 'area', label, default: def, hint, rows })
export const editor = (label, def = '', hint) => ({ kind: 'editor', label, default: def, hint })
export const image = (label, hint) => ({ kind: 'image', label, hint })
export const file = (label, hint) => ({ kind: 'file', label, hint })
export const gallery = (label, hint, directory) => ({ kind: 'gallery', label, hint, directory })
/** Lista powtarzalnych wpisów (np. osoby, partnerzy) — kolejność przeciąganiem. */
export const repeater = (label, hint, addLabel, subfields) => ({ kind: 'repeater', label, hint, addLabel, subfields })
export const link = (label, def = '', hint) => ({ kind: 'text', label, default: def, hint, link: true })
export const color = (label, def, hint) => ({ kind: 'color', label, default: def, hint })

// Zamienia zwykły tekst z CMS (akapity oddzielone pustą linią, krótkie śródtytuły,
// listy z emoji, linie „Nazwa https://…”) na HTML dla pola z edytorem —
// ta sama logika, którą frontend stosuje dla zwykłego tekstu (parseRichText).
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const EMOJI_LEAD = /^((?:\p{Extended_Pictographic}|\p{Regional_Indicator}{2})(?:️|‍\p{Extended_Pictographic}|\p{Emoji_Modifier})*)\s*(.*)$/u
const LINK_LINE = /^(.+?)\s+(https?:\/\/\S+)$/
const autolink = (s) => esc(s).replace(/(https?:\/\/[^\s)<]+)/g, '<a href="$1">$1</a>')

export function textToHtml(text) {
  const out = []
  for (const group of (text || '').trim().split(/\n\s*\n/)) {
    const lines = group.split('\n').map((l) => l.trim()).filter(Boolean)
    if (!lines.length) continue
    if (lines.every((l) => LINK_LINE.test(l))) {
      out.push('<ul>' + lines.map((l) => { const [, label, url] = l.match(LINK_LINE); return `<li><p><a href="${esc(url)}">${esc(label.replace(/[\s–—:-]+$/, ''))}</a></p></li>` }).join('') + '</ul>')
      continue
    }
    if (lines.length >= 2 && lines.every((l) => EMOJI_LEAD.test(l) && l.length <= 100)) {
      out.push('<ul>' + lines.map((l) => `<li><p>${esc(l)}</p></li>`).join('') + '</ul>')
      continue
    }
    let rest = lines
    if (lines.length >= 2 && lines[0].length <= 90 && !/[.!?:;,…]$/.test(lines[0])) {
      out.push(`<h2>${esc(lines[0])}</h2>`)
      rest = lines.slice(1)
    }
    for (const l of rest) out.push(`<p>${autolink(l)}</p>`)
  }
  return out.join('')
}
