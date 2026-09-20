import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'flagship-tiles',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: {
    primaryField: 'title',
    overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 25 },
  },
  fields: {
    title: { type: 'text', options: { required: true } },
    description: { type: 'text-area', options: { required: true, rows: 2 } },
    back: { type: 'text-area', options: { required: true, label: 'Tekst na odwrocie kafelka', rows: 3 } },
    image: { type: 'text', options: { required: true, label: 'Zdjęcie (URL)' } },
    moreHref: { type: 'text', options: { required: true, label: 'Link "Więcej"' } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność wyświetlania' } },
  },
})
