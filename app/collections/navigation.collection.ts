import { defineCollection } from '#pruvious'

/**
 * Pozycje menu strony — nagłówek (górna nawigacja) i stopka czytają tę samą
 * kolekcję, a o tym gdzie dana pozycja się pojawi decydują pola
 * "Pokaż w nagłówku" / "Pokaż w stopce".
 *
 * Zagnieżdżenie (rozwijane podmenu) budowane jest przez pole `parentKey`:
 * pozycja bez `parentKey` jest pozycją najwyższego poziomu, a pozycja z
 * `parentKey` równym `key` innego rekordu staje się jej pozycją podrzędną.
 * Obsługiwane są dwa poziomy — pozycja podrzędna nie może mieć własnych
 * pozycji podrzędnych.
 *
 * Jeśli kolekcja jest pusta, frontend pokazuje wbudowane, zapasowe menu —
 * dzięki temu strona nigdy nie zostaje bez nawigacji.
 */
export default defineCollection({
  name: 'navigation',
  mode: 'multi',
  label: { collection: { plural: 'menu strony', singular: 'pozycja menu' } },
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  search: { default: ['key', 'label'] },
  dashboard: {
    primaryField: 'label',
    overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 100 },
  },
  fields: {
    key: {
      type: 'text',
      options: {
        required: true,
        label: 'Identyfikator',
        description:
          'Unikalny, stabilny identyfikator pozycji, np. szlaki, o-nas, o-nas-misja. Używany przez pozycje podrzędne w polu "Identyfikator rodzica" — po zmianie identyfikatora trzeba poprawić też jego dzieci.',
      },
      additional: { unique: 'allLanguages', index: true },
    },
    parentKey: {
      type: 'text',
      options: {
        required: false,
        label: 'Identyfikator rodzica',
        description:
          'Puste = pozycja najwyższego poziomu. Wpisanie tutaj "Identyfikatora" innej pozycji wrzuca tę pozycję do jej rozwijanego podmenu. Tylko dwa poziomy — pozycja podrzędna nie może mieć własnych dzieci.',
      },
    },
    label: { type: 'text', options: { required: true, label: 'Etykieta', description: 'Tekst widoczny w menu.' } },
    url: {
      type: 'text',
      options: {
        required: true,
        label: 'Adres (URL)',
        description: 'Ścieżka wewnątrz serwisu, np. /szlaki lub /o-nas/misja.',
      },
    },
    order: {
      type: 'number',
      options: {
        required: true,
        default: 0,
        label: 'Kolejność',
        description: 'Rosnąco — mniejsza liczba = wcześniej. Pozycje podrzędne sortowane są niezależnie, w obrębie swojego rodzica.',
      },
    },
    showInHeader: {
      type: 'checkbox',
      options: {
        default: true,
        label: 'Pokaż w nagłówku',
        description: 'Pozycja podrzędna pojawi się w podmenu tylko wtedy, gdy jej rodzic też jest pokazany w nagłówku.',
      },
    },
    showInFooter: {
      type: 'checkbox',
      options: {
        default: true,
        label: 'Pokaż w stopce',
        description: 'Stopka jest płaska — pozycje podrzędne nie są w niej wyświetlane.',
      },
    },
  },
})
