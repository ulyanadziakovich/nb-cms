import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'reports',
  mode: 'multi',
  label: { collection: { plural: 'sprawozdania', singular: 'sprawozdanie' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'title', overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 100 } },
  fields: {
    year: { type: 'text', options: { required: true } },
    title: { type: 'text', options: { required: true } },
    file: { type: 'file', options: { required: false, label: 'Plik sprawozdania (PDF)', description: 'Wgraj plik z komputera albo wybierz z mediów — po zapisaniu od razu jest do pobrania na stronie.' } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność', description: 'Ustawiana przeciąganiem na liście (uchwyt ⠿).' } },
  },
})
