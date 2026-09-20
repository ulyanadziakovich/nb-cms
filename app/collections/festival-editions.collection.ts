import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'festival-editions',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'title', overviewTable: { sort: { field: 'year', direction: 'desc' }, perPage: 50 } },
  fields: {
    year: { type: 'text', options: { required: true } },
    title: { type: 'text', options: { required: true } },
    description: { type: 'text-area', options: { required: true, rows: 3 } },
    image: { type: 'text', options: { required: true, label: 'Zdjęcie (URL)' } },
    featured: { type: 'checkbox', options: { label: 'Najnowsza edycja', default: false } },
  },
})
