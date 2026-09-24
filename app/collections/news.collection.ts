import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'news',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  search: { default: [{ field: 'title', reserve: 30 }, 'excerpt'] },
  dashboard: {
    primaryField: 'title',
    overviewTable: { sort: { field: 'date', direction: 'desc' }, perPage: 25 },
  },
  fields: {
    slug: { type: 'text', options: { required: true, description: 'Unikalny identyfikator w adresie URL' } },
    title: { type: 'text', options: { required: true } },
    date: { type: 'text', options: { required: true, description: 'np. 3 marca 2026' } },
    category: { type: 'text', options: { required: true, description: 'np. Rekrutacja, Relacja, Turystyka' } },
    image: { type: 'image', options: { required: true, label: 'Zdjęcie' } },
    excerpt: { type: 'text-area', options: { required: true, label: 'Zajawka', rows: 3 } },
    body: { type: 'text-area', options: { required: true, label: 'Treść (akapity oddzielone pustą linią)', rows: 8 } },
    gallery: { type: 'text-area', options: { required: false, label: 'Galeria (jeden URL na linię — plik wgrany osobno, wklej tu jego ścieżkę /uploads/...)', rows: 4 } },
  },
})
