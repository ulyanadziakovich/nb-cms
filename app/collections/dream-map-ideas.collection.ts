import { defineCollection } from '#pruvious'

/**
 * Pomysły zgłoszone przez mieszkańców formularzem „Zgłoś swój pomysł” na
 * stronie „Ustrzyki 2036: Cyfrowa Mapa Marzeń”. Rekordy tworzy wyłącznie
 * endpoint server/api/dream-map-idea.post.ts — kolekcja nie ma publicznych
 * tras API (dane kontaktowe zgłaszających widać tylko w panelu).
 */
export default defineCollection({
  name: 'dream-map-ideas',
  mode: 'multi',
  translatable: false,
  label: { collection: { plural: 'zgłoszone pomysły', singular: 'zgłoszony pomysł' } },
  apiRoutes: {},
  search: { default: ['title', 'contact'] },
  dashboard: {
    primaryField: 'title',
    overviewTable: { sort: { field: 'createdAt', direction: 'desc' }, perPage: 50 },
  },
  fields: {
    title: { type: 'text', options: { required: true, label: 'Tytuł pomysłu' } },
    problem: { type: 'text-area', options: { required: true, label: 'Opis problemu do rozwiązania', rows: 5 } },
    solution: { type: 'text-area', options: { required: true, label: 'Propozycja rozwiązania / pomysł', rows: 5 } },
    contact: { type: 'text', options: { required: true, label: 'Kontakt (e-mail / telefon)' } },
  },
})
