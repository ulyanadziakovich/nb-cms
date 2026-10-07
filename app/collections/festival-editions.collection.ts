import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'festival-editions',
  mode: 'multi',
  label: { collection: { plural: 'festiwal — edycje', singular: 'edycja festiwalu' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: {
    primaryField: 'title',
    overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 100 },
    additionalRecordOptionsVueComponent: './app/dashboard/ViewOnSite.vue',
  },
  fields: {
    slug: { type: 'text', options: { required: true, description: 'Unikalny identyfikator w adresie URL' } },
    year: { type: 'text', options: { required: true } },
    title: { type: 'text', options: { required: true } },
    description: { type: 'text-area', options: { required: true, rows: 3 } },
    image: { type: 'image', options: { required: true, label: 'Zdjęcie główne' } },
    photos: { type: 'gallery', options: { label: 'Zdjęcia (galeria)', description: 'Wgraj wiele zdjęć naraz albo dodaj z biblioteki mediów. Kolejność zmieniasz przeciąganiem.', directory: 'kultura/galerie/' } },
    gallery: { type: 'text-area', options: { required: false, label: 'Stara galeria (adresy) — nie używać', description: 'Zastąpiona polem „Zdjęcia (galeria)” powyżej. Zostaje tylko jako kopia zapasowa.', rows: 4 } },
    featured: { type: 'checkbox', options: { label: 'Najnowsza edycja', default: false } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność', description: 'Ustawiana przeciąganiem na liście (uchwyt ⠿).' } },
  },
})
