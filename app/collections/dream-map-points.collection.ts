import { defineCollection } from '#pruvious'

/**
 * The 18 postulates behind the "Ustrzyki 2036: Cyfrowa Mapa Marzeń"
 * interactive page — one "star" per record. `pointNumber` (not the DB id)
 * is what the frontend's constellation-line map references, so it stays
 * stable no matter how records get reordered/recreated in the dashboard.
 */
export default defineCollection({
  name: 'dream-map-points',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  search: { default: [{ field: 'title', reserve: 30 }] },
  dashboard: {
    primaryField: 'title',
    overviewTable: { sort: { field: 'pointNumber', direction: 'asc' }, perPage: 25 },
  },
  fields: {
    pointNumber: {
      type: 'number',
      options: {
        required: true,
        label: 'Numer punktu',
        description: 'Stały numer punktu (1-18) — używany do rysowania linii gwiazdozbioru na mapie, nie zmieniaj bez potrzeby.',
      },
      additional: { unique: 'allLanguages', index: true },
    },
    category: {
      type: 'select',
      options: {
        required: true,
        choices: {
          ekologia: 'Ekologia',
          turystyka: 'Turystyka',
          mlodziez: 'Młodzież',
          seniorzy: 'Seniorzy',
          infrastruktura: 'Infrastruktura',
        },
      },
    },
    title: { type: 'text', options: { required: true } },
    challenge: { type: 'text-area', options: { required: true, label: 'Wyzwanie', rows: 4 } },
    solution: { type: 'text-area', options: { required: true, label: 'Propozycja rozwiązania', rows: 4 } },
    px: {
      type: 'number',
      options: { required: true, label: 'Pozycja X (%)', decimals: 1, description: 'Pozioma pozycja gwiazdy na mapie, w % szerokości.' },
    },
    py: {
      type: 'number',
      options: { required: true, label: 'Pozycja Y (%)', decimals: 1, description: 'Pionowa pozycja gwiazdy na mapie, w % wysokości.' },
    },
    votes: {
      type: 'number',
      options: {
        required: false,
        default: 0,
        min: 0,
        label: 'Głosy',
        description: 'Liczba głosów oddanych na ten postulat. Zwiększana wyłącznie przez publiczny endpoint głosowania (server/api/dream-map-vote.post.ts) — nie przez ten formularz.',
      },
    },
  },
})
