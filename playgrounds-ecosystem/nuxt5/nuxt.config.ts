// Production compatibility playground — Nuxt 5 (nightly).
//
// Verified with `nuxi build` (production) + `nuxi typecheck` — NOT `nuxi dev`;
// see `../README.md` ("Why build + typecheck, not dev"). `@nuxt/devtools`
// links this repo's own build (`link:../../packages/devtools`) and no-ops in
// production, so the build is a "does the module resolve + the app build on
// this Nuxt major" smoke test.
//
// Nuxt 5 ships the next-gen Nitro v3 engine (the `nitro` package), so this
// workspace has **only** `nitro` installed — `nitropack` (Nitro v2) is absent.
// Together with `../nuxt4` (Nuxt 4 → only `nitropack`) it covers a consumer
// with just one of the two optional-peer Nitro engines.
export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
  ],

  compatibilityDate: '2024-09-19',

  // A Nitro (v3) storage mount, so the config exercises Nitro-typed options.
  nitro: {
    storage: {
      playground: {
        driver: 'memory',
      },
    },
  },
})
