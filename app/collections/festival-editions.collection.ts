import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'festival-editions',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'title', overviewTable: { sort: { field: 'year', direction: 'desc' }, perPage: 50 } },
  fields: {
    slug: { type: 'text', options: { required: true, description: 'Unikalny identyfikator w adresie URL' } },
    year: { type: 'text', options: { required: true } },
    title: { type: 'text', options: { required: true } },
    description: { type: 'text-area', options: { required: true, rows: 3 } },
    image: { type: 'image', options: { required: true, label: 'Zdjęcie główne' } },
    gallery: { type: 'text-area', options: { required: false, label: 'Galeria (jeden URL na linię — plik wgrany osobno, wklej tu jego ścieżkę /uploads/...)', rows: 4 } },
    featured: { type: 'checkbox', options: { label: 'Najnowsza edycja', default: false } },
  },
})
