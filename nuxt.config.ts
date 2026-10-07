// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Pinned so the CMS is always reachable at the same address the main site
  // (nb) expects — otherwise, if this port is already taken by another
  // project, Nuxt silently falls back to a different port and the site's
  // fetches to the CMS fail with nothing showing on-screen.
  devServer: { port: 4321 },
  modules: ["pruvious"],

  // Adres strony, na którą prowadzi przycisk „Zobacz na stronie” w panelu.
  runtimeConfig: {
    public: { siteUrl: 'https://nowoczesneb.vercel.app' },
  },

  // pruvious.jwt.secretKey is intentionally NOT set here — Pruvious reads it from the
  // NUXT_PRUVIOUS_JWT_SECRET_KEY env var (see .env, which is gitignored) so the real
  // secret never gets committed to the repo.

  // Sciezki zapisu wystawione przez env, bo w kontenerze root filesystem jest
  // read-only (readOnlyRootFilesystem: true) - jedyne zapisywalne miejsca to
  // wolumen /data i /tmp. Fallbacki zachowuja dotychczasowe zachowanie deva.
  pruvious: {
    // Lista rekordów w panelu z przeciąganiem kolejności (kopia komponentu Pruvious).
    dashboard: {
      baseComponents: {
        misc: {
          MultiCollectionsOverview: './app/dashboard/MultiCollectionsOverview.vue',
          // Menu panelu pogrupowane według stron witryny (app/dashboard/menuGroups.ts).
          Base: './app/dashboard/Base.vue',
        },
      },
    },
    database: process.env.NUXT_PRUVIOUS_DATABASE ?? 'sqlite:./pruvious.db',
    uploads: {
      drive: {
        type: 'local',
        path: process.env.NUXT_PRUVIOUS_UPLOADS_DRIVE_PATH ?? './.uploads',
      },
      // Limit ustawiony jawnie, zeby byl widoczny w konfiguracji, a nie ukryty
      // w domyslnych wartosciach modulu (Pruvious sam z siebie tez daje 16 MB).
      // Z zapasem starcza na pliki GPX tras (najwieksze maja ok. 280 KB).
      maxFileSize: '16 MB',
    },
    pageCache: {
      type: 'local',
      path: process.env.NUXT_PRUVIOUS_PAGE_CACHE_PATH ?? './.cache/pages',
    },
  },
})