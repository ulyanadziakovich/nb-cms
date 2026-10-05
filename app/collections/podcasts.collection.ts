import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'podcasts',
  mode: 'multi',
  label: { collection: { plural: 'podcasty', singular: 'podcast' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'title', overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 100 } },
  fields: {
    title: { type: 'text', options: { required: true } },
    href: { type: 'text', options: { required: false, label: 'Link do odcinka' } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
