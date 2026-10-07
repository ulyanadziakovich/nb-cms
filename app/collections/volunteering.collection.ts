import { defineCollection } from '#pruvious'

/**
 * Podstrona „O nas → Wolontariat” w jednym miejscu: tytuł, opis i dokumenty.
 * Dokument dodaje się przyciskiem „Dodaj dokument” — wpisujesz nazwę, wybierasz
 * lub wgrywasz plik, zapisujesz i od razu jest na stronie.
 */
export default defineCollection({
  name: 'volunteering',
  mode: 'single',
  label: { collection: { plural: 'wolontariat', singular: 'wolontariat' } },
  translatable: false,
  // Ukryte w panelu: wolontariat jest teraz w formularzu „Strona: O nas” (zakładka „Wolontariat”). Dane zostają jako kopia.
  dashboard: { visible: false, additionalRecordOptionsVueComponent: './app/dashboard/ViewOnSite.vue' },
  apiRoutes: { read: 'public' },
  fields: {
    title: { type: 'text', options: { required: true, label: 'Tytuł strony', default: 'Wolontariat' } },
    description: {
      type: 'text-area',
      options: {
        required: false,
        label: 'Opis (akapity oddzielone pustą linią)',
        rows: 8,
        default: 'Wkrótce zamieścimy tutaj informacje o wolontariacie w Stowarzyszeniu Nowoczesne Bieszczady.',
      },
    },
    documents: {
      type: 'repeater',
      options: {
        label: 'Dokumenty do pobrania / wglądu',
        description: 'Kliknij „Dodaj dokument”, wpisz nazwę i wybierz plik (np. PDF). Kolejność zmienisz, przeciągając dokumenty.',
        addLabel: 'Dodaj dokument',
        subfields: {
          label: { type: 'text', options: { required: true, label: 'Nazwa dokumentu', placeholder: 'np. Porozumienie wolontariackie' } },
          file: { type: 'file', options: { required: true, label: 'Plik' } },
        },
      },
    },
  },
})
