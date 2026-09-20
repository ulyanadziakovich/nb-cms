import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'partners',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'name', overviewTable: { perPage: 50 } },
  fields: {
    name: { type: 'text', options: { required: true } },
    logo: { type: 'text', options: { required: false, label: 'Logo (URL)' } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
