import { defineCollection } from '#pruvious'

/**
 * Generic keyed text blocks used across the marketing site, so editorial copy
 * (headings, descriptions, paragraphs) never has to be hardcoded in the frontend.
 * The frontend fetches the whole collection once and looks up blocks by `key`.
 */
export default defineCollection({
  name: 'page-content',
  mode: 'multi',
  label: { collection: { plural: 'teksty na stronach', singular: 'tekst na stronie' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  search: { default: ['key', 'title'] },
  dashboard: {
    // Ukryte w panelu: wszystkie teksty są w formularzach „Strona: …”. Dane zostają jako kopia.
    visible: false,
    primaryField: 'key',
    overviewTable: { sort: { field: 'key', direction: 'asc' }, perPage: 100 },
  },
  fields: {
    key: {
      type: 'text',
      options: { required: true, description: 'Unikalny identyfikator bloku, np. home-hero-title, kultura-intro' },
      additional: { unique: 'allLanguages', index: true },
    },
    title: {
      type: 'text',
      options: {
        required: false,
        label: 'Tytuł strony / nagłówek',
        description: 'Przy blokach „…-hero-description” to duży tytuł na górze podstrony.',
      },
    },
    content: {
      type: 'editor',
      options: {
        required: false,
        label: 'Opis sformatowany (akapity, śródtytuły, linki, listy)',
        description: [
          'Jeśli to pole jest wypełnione, strona pokazuje je zamiast „Zwykłego tekstu” poniżej.',
          'Enter = nowy akapit. Zaznacz tekst, aby dodać link, pogrubienie lub śródtytuł.',
        ],
        toolbar: ['heading2', 'heading3', 'paragraph', 'bold', 'italic', 'link', 'bulletList', 'orderedList', 'blockquote', 'clear', 'undo', 'redo'],
      },
    },
    body: {
      type: 'text-area',
      options: {
        required: false,
        label: 'Zwykły tekst',
        description: 'Akapity oddzielone pustą linią. Przy listach i statystykach: jedna pozycja w linii.',
        rows: 5,
      },
    },
    image: { type: 'text', options: { required: false, label: 'Zdjęcie (URL, opcjonalnie)' } },
  },
})
