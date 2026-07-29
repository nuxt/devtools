// Production compatibility playground — Nuxt 4 (stable).
//
// Nuxt 4 ships Nitro v2 (the `nitropack` package), so this workspace has
// **only** `nitropack` installed — `nitro` (Nitro v3) is absent. Together with
// `../nuxt5` (Nuxt 5 → only `nitro`) it proves this repo's `@nuxt/devtools`
// builds and type-checks against a consumer that has just one of the two
// optional-peer Nitro engines. See `../README.md`.
//
// `@nuxt/devtools` is a `link:../../packages/devtools` dependency — this repo's
// own build, never the npm registry. Set `NUXT_DEVTOOLS_LOCAL=true` for the
// HMR-over-subprocess client wrapper (`../../local`); leave it unset to load
// the built module directly.
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'

export default defineNuxtConfig({
  modules: [
    devtoolsModule,
  ],

  compatibilityDate: '2024-09-19',

  future: {
    compatibilityVersion: 4,
  },

  // A Nitro (v2) storage mount, so the config exercises Nitro-typed options
  // and the DevTools Storage panel has a real surface to read in dev.
  nitro: {
    storage: {
      playground: {
        driver: 'memory',
      },
    },
  },
})
