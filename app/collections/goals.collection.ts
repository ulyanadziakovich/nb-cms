import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'goals',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'title', overviewTable: { perPage: 50 } },
  fields: {
    title: { type: 'text', options: { required: true } },
    description: { type: 'text-area', options: { required: true, rows: 3 } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
