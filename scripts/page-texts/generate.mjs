// Generuje formularze CMS („Strona: …”) i zapasowe teksty dla frontendu z jednego
// źródła: scripts/page-texts/spec.mjs.
//
//   node scripts/page-texts/generate.mjs [ścieżka do repo frontendu, domyślnie ../nb]
//
// Wynik:
//   app/collections/<nazwa>.collection.ts           (CMS, nie edytuj ręcznie)
//   <frontend>/app/utils/pageTextDefaults.ts        (frontend, nie edytuj ręcznie)
import { writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import spec from './spec.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const frontend = resolve(root, process.argv[2] ?? '../nb')
const q = (s) => JSON.stringify(s)
const EDITOR_TOOLBAR = ['heading2', 'heading3', 'paragraph', 'bold', 'italic', 'link', 'bulletList', 'orderedList', 'blockquote', 'clear', 'undo', 'redo']

function fieldSource(f) {
  const opts = { required: false, label: f.label }
  if (f.hint) opts.description = f.hint
  switch (f.kind) {
    case 'text':
      if (f.default) opts.default = f.default
      if (f.link) opts.placeholder = 'np. /aktualnosci albo https://…'
      return `{ type: 'text', options: ${JSON.stringify(opts)} }`
    case 'color':
      opts.default = f.default
      return `{ type: 'color', options: ${JSON.stringify(opts)} }`
    case 'area':
      if (f.default) opts.default = f.default
      opts.rows = f.rows ?? 3
      return `{ type: 'text-area', options: ${JSON.stringify(opts)} }`
    case 'editor':
      if (f.default) opts.default = f.default
      opts.toolbar = EDITOR_TOOLBAR
      return `{ type: 'editor', options: ${JSON.stringify(opts)} }`
    case 'image':
      return `{ type: 'image', options: ${JSON.stringify(opts)} }`
    case 'file':
      return `{ type: 'file', options: ${JSON.stringify(opts)} }`
    case 'repeater':
      opts.addLabel = f.addLabel
      return `{ type: 'repeater', options: { ...${JSON.stringify(opts)}, subfields: ${JSON.stringify(f.subfields)} } }`
    case 'gallery':
      if (f.directory) opts.directory = f.directory
      return `{ type: 'gallery', options: ${JSON.stringify(opts)} }`
    default:
      throw new Error(`Nieznany typ pola: ${f.kind}`)
  }
}

const PAGE_THEME = {
  themeBackground: { kind: 'color', label: 'Tło strony', default: '', hint: 'Tło całej treści tej podstrony.' },
  themeHero: { kind: 'color', label: 'Tło nagłówka', default: '', hint: 'Tło górnej części z tytułem podstrony.' },
  themeTitle: { kind: 'color', label: 'Tytuły i nagłówki', default: '', hint: 'Tytuł podstrony, tytuły sekcji i kart.' },
  themeLead: { kind: 'color', label: 'Opisy wyróżnione (wstępy)', default: '', hint: 'Pierwszy akapit opisów i teksty pod tytułami sekcji.' },
  themeBody: { kind: 'color', label: 'Zwykły tekst', default: '', hint: 'Akapity w opisach i na kartach.' },
  themeAccent: { kind: 'color', label: 'Akcent: przyciski, linki, napisy nad tytułami', default: '' },
}

const defaults = {}
for (const page of spec) {
  if (page.name !== 'site-settings') {
    page.layoutExtras = { ...page.layoutExtras, 'Wygląd tej strony': ['<./app/dashboard/ThemePreview.vue>'] }
    page.tabs = { ...page.tabs, 'Wygląd tej strony': PAGE_THEME }
  }
  const fields = []
  const layout = {}
  defaults[page.name] = {}
  for (const [tab, tabFields] of Object.entries(page.tabs)) {
    layout[tab] = [...(page.layoutExtras?.[tab] ?? []), ...Object.keys(tabFields)]
    for (const [key, f] of Object.entries(tabFields)) {
      fields.push(`    ${key}: ${fieldSource(f)},`)
      if (['text', 'area', 'editor', 'color'].includes(f.kind)) defaults[page.name][key] = f.default ?? ''
    }
  }
  const src = `// WYGENEROWANE z scripts/page-texts/spec.mjs — nie edytuj ręcznie.
// Zmiany: popraw spec.mjs i uruchom \`node scripts/page-texts/generate.mjs\`.
import { defineCollection } from '#pruvious'

export default defineCollection({
  name: ${q(page.name)},
  mode: 'single',
  label: { collection: { plural: ${q(page.label)}, singular: ${q(page.label)} } },
  apiRoutes: { read: 'public' },
  dashboard: {
    icon: ${q(page.icon ?? 'File')},
    additionalRecordOptionsVueComponent: './app/dashboard/ViewOnSite.vue',
    fieldLayout: [${JSON.stringify(layout)}],
  },
  fields: {
${fields.join('\n')}
  },
})
`
  writeFileSync(join(root, 'app/collections', `${page.name}.collection.ts`), src)
}

const pages = Object.fromEntries(spec.map((p) => [p.name, p.url ?? null]))
writeFileSync(
  join(frontend, 'app/utils/pageTextDefaults.ts'),
  `// WYGENEROWANE z nb-cms/scripts/page-texts/spec.mjs — nie edytuj ręcznie.
// Teksty startowe każdego formularza „Strona: …” w CMS. Strona pokazuje je tylko,
// gdy CMS nie ma jeszcze danego pola (np. przed wdrożeniem nowej wersji CMS).
export const pageTextDefaults = ${JSON.stringify(defaults, null, 2)} as const

/** Adres podstrony dla każdego formularza (przycisk „Zobacz na stronie”). */
export const pageTextUrls = ${JSON.stringify(pages, null, 2)} as const

export type PageTextName = keyof typeof pageTextDefaults
`,
)
console.log(`Wygenerowano ${spec.length} formularzy CMS i ${frontend}/app/utils/pageTextDefaults.ts`)
