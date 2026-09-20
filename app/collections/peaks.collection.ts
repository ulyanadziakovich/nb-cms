import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'peaks',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'name', overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 50 } },
  fields: {
    name: { type: 'text', options: { required: true } },
    elevation: { type: 'number', options: { required: true, label: 'Wysokość (m n.p.m.)' } },
    note: { type: 'text-area', options: { required: true, rows: 3 } },
    tower: { type: 'checkbox', options: { label: 'Wieża widokowa', default: false } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność na trasie' } },
  },
})
