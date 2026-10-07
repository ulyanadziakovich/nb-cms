import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'contests',
  mode: 'multi',
  label: { collection: { plural: 'konkursy', singular: 'konkurs' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  dashboard: { primaryField: 'title', overviewTable: { columns: ['title', { field: 'active', width: 22 }], sort: { field: 'order', direction: 'asc' }, perPage: 100 } },
  fields: {
    title: { type: 'text', options: { required: true } },
    active: {
      type: 'checkbox',
      options: {
        label: 'Aktywny (widoczny na stronie)',
        description: 'Odznaczony = konkurs ukryty na stronie.',
        default: false,
      },
    },
    description: { type: 'text-area', options: { required: true, rows: 3 } },
    fundingNote: { type: 'text-area', options: { required: false, rows: 2, label: 'Informacja o finansowaniu' } },
    image: { type: 'image', options: { required: true, label: 'Zdjęcie' } },
    facts: {
      type: 'repeater',
      options: {
        label: 'Najważniejsze informacje (ramka na stronie)',
        description: 'Np. Kategorie / Termin zgłoszeń / Gala i nagrody. Kolejność zmienisz, przeciągając.',
        addLabel: 'Dodaj informację',
        subfields: {
          label: { type: 'text', options: { required: true, label: 'Nazwa', placeholder: 'np. Termin zgłoszeń' } },
          value: { type: 'text', options: { required: true, label: 'Wartość', placeholder: 'np. do 11 listopada 2026' } },
        },
      },
    },
    documents: {
      type: 'repeater',
      options: {
        label: 'Dokumenty do pobrania',
        description: 'Kliknij „Dodaj dokument”, wpisz nazwę i wybierz plik (np. PDF) — po zapisaniu od razu jest na stronie.',
        addLabel: 'Dodaj dokument',
        subfields: {
          label: { type: 'text', options: { required: true, label: 'Nazwa dokumentu', placeholder: 'np. Regulamin konkursu' } },
          file: { type: 'file', options: { required: true, label: 'Plik' } },
        },
      },
    },
    laureatesTitle: {
      type: 'text',
      options: { required: false, label: 'Laureaci — tytuł sekcji', placeholder: 'np. Laureaci III edycji (2025)' },
    },
    laureates: {
      type: 'repeater',
      options: {
        label: 'Laureaci (nagrodzone prace)',
        description: 'Galeria nagrodzonych prac pod konkursem. Kliknij „Dodaj pracę”, wgraj zdjęcie i uzupełnij dane. Kolejność zmienisz, przeciągając.',
        addLabel: 'Dodaj pracę',
        subfields: {
          image: { type: 'image', options: { required: true, label: 'Zdjęcie pracy' } },
          title: { type: 'text', options: { required: true, label: 'Tytuł pracy' } },
          author: { type: 'text', options: { required: true, label: 'Autor' } },
          category: { type: 'text', options: { required: false, label: 'Kategoria', placeholder: 'np. Krajobrazy' } },
          award: {
            type: 'select',
            options: {
              required: true,
              label: 'Nagroda',
              default: 'wyroznienie',
              choices: { 'i-miejsce': 'I miejsce', 'ii-miejsce': 'II miejsce', 'iii-miejsce': 'III miejsce', wyroznienie: 'Wyróżnienie' },
            },
          },
        },
      },
    },
    order: { type: 'number', options: { required: false, default: 0, label: 'Kolejność', description: 'Ustawiana przeciąganiem na liście (uchwyt ⠿).' } },
  },
})
