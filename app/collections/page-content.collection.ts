import { defineCollection } from '#pruvious'

/**
 * Generic keyed text blocks used across the marketing site, so editorial copy
 * (headings, descriptions, paragraphs) never has to be hardcoded in the frontend.
 * The frontend fetches the whole collection once and looks up blocks by `key`.
 */
export default defineCollection({
  name: 'page-content',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  search: { default: ['key', 'title'] },
  dashboard: {
    primaryField: 'key',
    overviewTable: { sort: { field: 'key', direction: 'asc' }, perPage: 100 },
  },
  fields: {
    key: {
      type: 'text',
      options: { required: true, description: 'Unikalny identyfikator bloku, np. home-hero-title, kultura-intro' },
      additional: { unique: 'allLanguages', index: true },
    },
    title: { type: 'text', options: { required: false, label: 'Tytuł / nagłówek (opcjonalnie)' } },
    body: { type: 'text-area', options: { required: false, label: 'Treść (akapity oddzielone pustą linią)', rows: 5 } },
    image: { type: 'text', options: { required: false, label: 'Zdjęcie (URL, opcjonalnie)' } },
  },
})
