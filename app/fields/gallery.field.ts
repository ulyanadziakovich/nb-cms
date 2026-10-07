import { defineField } from '#pruvious'

/**
 * Galeria zdjęć: wiele zdjęć naraz (wgrywanie albo wybór z biblioteki mediów),
 * kolejność przeciąganiem. W bazie lista `{ uploadId, alt }`, a na zewnątrz
 * (API z `populate`) gotowe adresy `{ src, alt, width, height }`.
 */
export default defineField({
  name: 'gallery',
  type: { js: 'object', ts: '{ uploadId: number, alt: string }[]', db: 'TEXT' },
  default: ({ options }) => options.default ?? [],
  vueComponent: './app/dashboard/GalleryField.vue',
  options: {
    required: {
      type: 'boolean',
      description: ['Czy galeria musi mieć co najmniej jedno zdjęcie.', '', '@default false'],
      default: () => false,
    },
    label: {
      type: 'string',
      description: ['Etykieta pola w panelu.'],
      default: () => 'Galeria',
    },
    description: {
      type: 'string | string[]',
      description: ['Podpowiedź w dymku przy polu.'],
    },
    directory: {
      type: 'string',
      description: ['Folder w mediach, do którego trafiają nowo wgrane zdjęcia.', '', "@default 'galerie/'"],
      default: () => 'galerie/',
    },
    default: {
      type: '{ uploadId: number, alt: string }[]',
      description: ['Wartość domyślna.', '', '@default []'],
    },
  },
  population: {
    type: { js: 'object', ts: '{ src: string, alt: string, width?: number, height?: number }[]' },
    populator: async ({ value, query }) => {
      const items = Array.isArray(value) ? value : []
      const ids = items.map((item: any) => item?.uploadId).filter((id: any) => Number.isInteger(id) && id > 0)
      if (!ids.length) return []
      const uploads = await query('uploads').whereIn('id', ids).all()
      const byId = new Map<number, any>(uploads.map((u: any) => [u.id, u]))
      return items
        .map((item: any) => {
          const upload = byId.get(item?.uploadId)
          if (!upload) return null
          return {
            src: `/uploads/${upload.directory}${upload.filename}`,
            alt: item.alt || upload.description || '',
            width: upload.width ?? undefined,
            height: upload.height ?? undefined,
          }
        })
        .filter(Boolean)
    },
  },
  sanitizers: [
    ({ value }) => {
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value)
        } catch {
          return value
        }
      }
      if (value === null || value === undefined) return []
      if (!Array.isArray(value)) return value
      return value.map((item: any) =>
        Number.isInteger(item) ? { uploadId: item, alt: '' } : { uploadId: Number(item?.uploadId), alt: String(item?.alt ?? '') },
      )
    },
  ],
  validators: [
    ({ __, language, value }) => {
      if (
        !Array.isArray(value) ||
        value.some((item: any) => !item || !Number.isInteger(item.uploadId) || item.uploadId <= 0 || typeof item.alt !== 'string')
      ) {
        throw new Error(__(language, 'pruvious-server', 'Invalid input type'))
      }
    },
    {
      onCreate: true,
      onUpdate: true,
      validator: ({ __, language, options, value }) => {
        if (options.required && (!Array.isArray(value) || !value.length)) {
          throw new Error(__(language, 'pruvious-server', 'This field is required'))
        }
      },
    },
  ],
})
