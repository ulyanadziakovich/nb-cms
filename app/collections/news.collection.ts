import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'news',
  mode: 'multi',
  label: { collection: { plural: 'aktualności', singular: 'aktualność' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  search: { default: [{ field: 'title', reserve: 30 }, 'excerpt'] },
  dashboard: {
    additionalRecordOptionsVueComponent: './app/dashboard/ViewOnSite.vue',
    primaryField: 'title',
    overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 100 },
  },
  fields: {
    slug: { type: 'text', options: { required: true, description: 'Unikalny identyfikator w adresie URL' } },
    title: { type: 'text', options: { required: true } },
    date: { type: 'text', options: { required: true, description: 'np. 3 marca 2026' } },
    showOn: {
      type: 'checkboxes',
      options: {
        label: 'Pokaż także na podstronach',
        description: 'Wpis zawsze jest w Aktualnościach. Zaznacz, gdzie jeszcze ma się pokazać (sekcja „Powiązane aktualności” na dole podstrony).',
        choices: {
          szlaki: 'Szlaki rowerowe',
          'ustrzyki-2036': 'Ustrzyki 2036',
          'korona-gor': 'Korona Ustrzyckich Gór',
          kultura: 'Kultura',
          inicjatywy: 'Inicjatywy',
          'o-nas': 'O nas',
        },
      },
    },
    category: {
      type: 'select',
      options: {
        required: true,
        label: 'Kategoria',
        default: 'Blog',
        choices: { Blog: 'Blog', Sport: 'Sport', Festiwal: 'Festiwal', Projekt: 'Projekt', Warsztat: 'Warsztat' },
        description: 'Kategoria widoczna na karcie wpisu i w filtrze na stronie Aktualności.',
      },
    },
    image: { type: 'image', options: { required: true, label: 'Zdjęcie' } },
    excerpt: { type: 'text-area', options: { required: true, label: 'Zajawka', rows: 3 } },
    body: { type: 'text-area', options: { required: true, label: 'Treść (akapity oddzielone pustą linią)', rows: 8 } },
    photos: { type: 'gallery', options: { label: 'Zdjęcia (galeria)', description: 'Wgraj wiele zdjęć naraz albo dodaj z biblioteki mediów. Kolejność zmieniasz przeciąganiem.', directory: 'aktualnosci/galerie/' } },
    gallery: { type: 'text-area', options: { required: false, label: 'Stara galeria (adresy) — nie używać', description: 'Zastąpiona polem „Zdjęcia (galeria)” powyżej. Zostaje tylko jako kopia zapasowa.', rows: 4 } },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność', description: 'Ustawiana przeciąganiem na liście (uchwyt ⠿).' } },
  },
})
