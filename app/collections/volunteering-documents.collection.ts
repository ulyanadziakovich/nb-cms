import { defineCollection } from '#pruvious'

/** Dokumenty do pobrania / wglądu na podstronie „O nas → Wolontariat”. */
export default defineCollection({
  name: 'volunteering-documents',
  mode: 'multi',
  translatable: false,
  label: { collection: { plural: 'wolontariat — dokumenty', singular: 'dokument wolontariatu' } },
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: {
    primaryField: 'label',
    overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 50 },
  },
  fields: {
    label: { type: 'text', options: { required: true, label: 'Nazwa dokumentu', description: 'np. Porozumienie wolontariackie (PDF)' } },
    file: { type: 'file', options: { required: true, label: 'Plik', description: 'Wgraj plik do mediów i wybierz go tutaj.' } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
