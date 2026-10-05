import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'events',
  mode: 'multi',
  label: { collection: { plural: 'wydarzenia', singular: 'wydarzenie' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  search: { default: [{ field: 'title', reserve: 30 }] },
  dashboard: {
    primaryField: 'title',
    overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 100 },
  },
  fields: {
    title: { type: 'text', options: { required: true } },
    date: { type: 'text', options: { required: true, description: 'np. 14 czerwca 2026' } },
    time: { type: 'text', options: { required: true, description: 'np. 09:00' } },
    place: { type: 'text', options: { required: true } },
    image: { type: 'image', options: { required: true, label: 'Zdjęcie' } },
    freeEntry: { type: 'checkbox', options: { label: 'Wstęp wolny', default: true } },
    ticketsHref: { type: 'text', options: { required: false, label: 'Link do biletów (jeśli płatne)' } },
    tag: { type: 'text', options: { required: false, default: 'ogolne', description: 'ogolne / sport — do filtrowania na stronach' } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność', description: 'Ustawiana przeciąganiem na liście (uchwyt ⠿).' } },
  },
})
