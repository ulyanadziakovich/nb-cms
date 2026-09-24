import { defineCollection } from '#pruvious'

/** Singleton settings for the "Ustrzyki 2036: Cyfrowa Mapa Marzeń" page —
 * currently just the night-sky hero photo, kept out of the frontend repo. */
export default defineCollection({
  name: 'dream-map-settings',
  mode: 'single',
  apiRoutes: { read: 'public' },
  fields: {
    heroImage: { type: 'image', options: { required: false, label: 'Zdjęcie tła (nocne niebo)' } },
  },
})
