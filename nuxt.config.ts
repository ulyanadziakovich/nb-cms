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

  // pruvious.jwt.secretKey is intentionally NOT set here — Pruvious reads it from the
  // NUXT_PRUVIOUS_JWT_SECRET_KEY env var (see .env, which is gitignored) so the real
  // secret never gets committed to the repo.
})