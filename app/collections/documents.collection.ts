import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'documents',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: {
    primaryField: 'label',
    overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 50 },
  },
  fields: {
    label: { type: 'text', options: { required: true, description: 'np. Statut Stowarzyszenia (PDF)' } },
    fileUrl: { type: 'text', options: { required: true, label: 'Plik (URL)' } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
