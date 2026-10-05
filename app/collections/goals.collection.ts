import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'goals',
  mode: 'multi',
  label: { collection: { plural: 'cele stowarzyszenia', singular: 'cel stowarzyszenia' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'title', overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 100 } },
  fields: {
    title: { type: 'text', options: { required: true } },
    description: { type: 'text-area', options: { required: true, rows: 3 } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
