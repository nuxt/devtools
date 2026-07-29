// Production compatibility playground — Nuxt 5 (nightly).
//
// Nuxt 5 ships the next-gen Nitro v3 engine (the `nitro` package), so this
// workspace has **only** `nitro` installed — `nitropack` (Nitro v2) is absent.
// Together with `../nuxt4` (Nuxt 4 → only `nitropack`) it proves this repo's
// `@nuxt/devtools` builds and type-checks against a consumer that has just one
// of the two optional-peer Nitro engines. See `../README.md`.
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

  // A Nitro (v3) storage mount, so the config exercises Nitro-typed options
  // and the DevTools Storage panel has a real surface to read in dev.
  nitro: {
    storage: {
      playground: {
        driver: 'memory',
      },
    },
  },
})
