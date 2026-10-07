import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'team',
  mode: 'multi',
  label: { collection: { plural: 'zarząd i zespół', singular: 'członek zarządu i zespołu' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  // Ukryte w panelu: osoby/partnerzy są teraz w formularzu „Strona: O nas”. Dane zostają jako kopia.
  dashboard: { visible: false, primaryField: 'name', overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 100 } },
  fields: {
    name: { type: 'text', options: { required: true } },
    photo: { type: 'image', options: { required: false, label: 'Zdjęcie' } },
    role: { type: 'text', options: { required: true } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
