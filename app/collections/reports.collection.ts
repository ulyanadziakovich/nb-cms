import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'reports',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'title', overviewTable: { sort: { field: 'year', direction: 'desc' }, perPage: 50 } },
  fields: {
    year: { type: 'text', options: { required: true } },
    title: { type: 'text', options: { required: true } },
    fileUrl: { type: 'text', options: { required: false, label: 'Plik PDF (URL)' } },
  },
})
