import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'contests',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'title', overviewTable: { perPage: 50 } },
  fields: {
    title: { type: 'text', options: { required: true } },
    description: { type: 'text-area', options: { required: true, rows: 3 } },
    fundingNote: { type: 'text-area', options: { required: false, rows: 2, label: 'Informacja o finansowaniu' } },
    image: { type: 'text', options: { required: true, label: 'Zdjęcie (URL)' } },
  },
})
