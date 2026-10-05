import { defineCollection } from '#pruvious'

/**
 * Postulaty interaktywnej strony "Ustrzyki 2036: Cyfrowa Mapa Marzeń" —
 * jeden rekord to jedna "gwiazda". `pointNumber` (a nie id z bazy) jest
 * identyfikatorem, po którym rysowane są linie gwiazdozbioru, więc zostaje
 * stabilny niezależnie od kolejności czy odtwarzania rekordów w panelu.
 * Krawędzie gwiazdozbioru trzyma pole `connectsTo`, a metadane kategorii
 * (kolor, nazwa gwiazdozbioru, etykiety) kolekcja `dream-map-categories`.
 */
export default defineCollection({
  name: 'dream-map-points',
  mode: 'multi',
  label: { collection: { plural: 'mapa Marzeń — pomysły', singular: 'pomysł Mapy Marzeń' } },
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
        description: 'Stały numer punktu — używany do rysowania linii gwiazdozbioru na mapie, nie zmieniaj bez potrzeby.',
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
    connectsTo: {
      type: 'text',
      options: {
        required: false,
        label: 'Połączenia gwiazdozbioru',
        description: 'Lista numerów punktów rozdzielona przecinkami, do których prowadzi linia z tego punktu, np. 4, 8. Puste = brak linii wychodzących.',
      },
    },
  },
})
