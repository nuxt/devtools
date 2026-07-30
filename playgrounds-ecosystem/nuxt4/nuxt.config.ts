// Production compatibility playground — Nuxt 4 (stable).
//
// Verified with `nuxi build` (production) + `nuxi typecheck` — NOT `nuxi dev`;
// see `../README.md` ("Why build + typecheck, not dev"). `@nuxt/devtools`
// links this repo's own build (`link:../../packages/devtools`) and no-ops in
// production, so the build is a "does the module resolve + the app build on
// this Nuxt major" smoke test.
//
// Nuxt 4 ships Nitro v2 (the `nitropack` package), so this workspace has
// **only** `nitropack` installed — `nitro` (Nitro v3) is absent. Together with
// `../nuxt5` (Nuxt 5 → only `nitro`) it covers a consumer with just one of the
// two optional-peer Nitro engines.
export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
  ],

  compatibilityDate: '2024-09-19',

  future: {
    compatibilityVersion: 4,
  },

  // A Nitro (v2) storage mount, so the config exercises Nitro-typed options.
  nitro: {
    storage: {
      playground: {
        driver: 'memory',
      },
    },
  },
})
