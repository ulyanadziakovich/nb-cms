import { defineCollection } from '#pruvious'

/**
 * Metadane kategorii (gwiazdozbiorów) dla interaktywnej strony
 * "Ustrzyki 2036: Cyfrowa Mapa Marzeń" — nazwa wyświetlana, nazwa gwiazdozbioru,
 * kolor oraz pozycje elementów ozdobnych (etykiety i "ogona" gwiazdozbioru).
 * Pole `slug` wiąże rekord z polem "Kategoria" (`category`) w kolekcji
 * `dream-map-points` — musi mieć dokładnie tę samą wartość, inaczej punkty
 * nie dostaną koloru ani opisu gwiazdozbioru.
 */
export default defineCollection({
  name: 'dream-map-categories',
  mode: 'multi',
  translatable: false,
  apiRoutes: { read: 'public', readMany: 'public' },
  search: { default: ['slug', 'label'] },
  dashboard: {
    primaryField: 'label',
    overviewTable: { sort: { field: 'order', direction: 'asc' }, perPage: 25 },
  },
  fields: {
    slug: {
      type: 'text',
      options: {
        required: true,
        label: 'Identyfikator (slug)',
        description:
          'Musi zgadzać się co do znaku z wartością pola "Kategoria" w kolekcji punktów mapy marzeń: ekologia, turystyka, mlodziez, seniorzy lub infrastruktura.',
      },
      additional: { unique: 'allLanguages', index: true },
    },
    label: { type: 'text', options: { required: true, label: 'Nazwa wyświetlana' } },
    constellation: { type: 'text', options: { required: true, label: 'Nazwa gwiazdozbioru' } },
    color: {
      type: 'text',
      options: { required: true, label: 'Kolor (hex)', description: 'Kolor gwiazd i linii tej kategorii, np. #135e24.' },
    },
    order: { type: 'number', options: { required: true, default: 0, label: 'Kolejność' } },
    labelX: {
      type: 'number',
      options: { required: true, label: 'Etykieta — pozycja X (%)', decimals: 1, description: 'Pozioma pozycja podpisu gwiazdozbioru, w % szerokości mapy.' },
    },
    labelY: {
      type: 'number',
      options: { required: true, label: 'Etykieta — pozycja Y (%)', decimals: 1, description: 'Pionowa pozycja podpisu gwiazdozbioru, w % wysokości mapy.' },
    },
    tailFromPoint: {
      type: 'number',
      options: {
        required: false,
        label: 'Ogon — numer punktu startowego',
        description: 'Numer punktu, z którego wychodzi ozdobny "ogon" gwiazdozbioru. Puste = brak ogona.',
      },
    },
    tailX: {
      type: 'number',
      options: { required: false, label: 'Ogon — koniec X (%)', decimals: 1, description: 'Pozioma pozycja końca ogona, w % szerokości mapy.' },
    },
    tailY: {
      type: 'number',
      options: { required: false, label: 'Ogon — koniec Y (%)', decimals: 1, description: 'Pionowa pozycja końca ogona, w % wysokości mapy.' },
    },
  },
})
