import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'team',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'name', overviewTable: { perPage: 50 } },
  fields: {
    name: { type: 'text', options: { required: true } },
    role: { type: 'text', options: { required: true } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
