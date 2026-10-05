import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'documents',
  mode: 'multi',
  label: { collection: { plural: 'dokumenty (stopka)', singular: 'dokument (stopka)' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: {
    primaryField: 'label',
    overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 100 },
  },
  fields: {
    label: { type: 'text', options: { required: true, description: 'np. Statut Stowarzyszenia (PDF)' } },
    fileUrl: { type: 'text', options: { required: true, label: 'Plik (URL)' } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
