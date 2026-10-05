import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'partners',
  mode: 'multi',
  label: { collection: { plural: 'partnerzy', singular: 'partner' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'name', overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 100 } },
  fields: {
    name: { type: 'text', options: { required: true } },
    logo: { type: 'image', options: { required: false, label: 'Logo' } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
