import { defineField } from '#pruvious'

/** Kolor do wyglądu strony: próbnik kolorów + kod #RRGGBB. Pusty = kolor domyślny strony. */
export default defineField({
  name: 'color',
  type: 'string',
  default: ({ options }) => options.default ?? '',
  vueComponent: './app/dashboard/ColorField.vue',
  options: {
    required: { type: 'boolean', description: ['Czy pole jest wymagane.', '', '@default false'], default: () => false },
    label: { type: 'string', description: ['Etykieta pola w panelu.'], default: () => 'Kolor' },
    description: { type: 'string | string[]', description: ['Podpowiedź w dymku przy polu.'] },
    default: { type: 'string', description: ['Kolor domyślny (#RRGGBB).'] },
  },
  sanitizers: [({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value)],
  validators: [
    // Brak wartości też jest błędem — dzięki temu Pruvious podstawia kolor domyślny.
    ({ value }) => {
      if (typeof value !== 'string' || (value !== '' && !/^#[0-9a-f]{6}$/.test(value))) {
        throw new Error('Podaj kolor w zapisie #RRGGBB, np. #a9541f')
      }
    },
  ],
})
