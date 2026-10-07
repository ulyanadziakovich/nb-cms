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
    file: { type: 'file', options: { required: false, label: 'Plik', description: 'Wgraj dokument (np. PDF) — link w stopce będzie go używał.' } },
    fileUrl: { type: 'text', options: { required: false, label: 'Stary adres pliku — nie trzeba wypełniać', description: 'Używany tylko, gdy pole „Plik” jest puste.' } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
