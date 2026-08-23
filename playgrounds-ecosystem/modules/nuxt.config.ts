// https://nuxt.com/docs/api/configuration/nuxt-config
//
// Ecosystem dogfooding playground — combines popular Nuxt modules that ship a
// Nuxt DevTools integration, wired to the LOCAL @nuxt/devtools, to verify
// their DevTools tabs render against this repo's own build (see ../REPORTS.md
// for the findings). Two groups live here:
//
//   * "Original" trio — nuxt-og-image, @nuxt/scripts, @nuxt/fonts (not in the
//     nuxt.com "Devtools" category, kept from the first dogfooding pass).
//   * "Devtools category" set — @nuxt/eslint, @nuxt/hints, @nuxt/a11y,
//     @compodium/nuxt, @scalar/nuxt — drawn from
//     https://nuxt.com/modules?category=Devtools, curated down to the ones
//     that actually register a DevTools tab. Modules from that category with
//     no DevTools surface (test-utils, typed-router, prepare, …), secret-gated
//     ones (doppler, ngrok), or heavy/deprecated ones (storybook, workflow,
//     sonda, eslint-module) are intentionally left out — see ../REPORTS.md.
//
// @nuxt/content and @nuxt/image were tried in the first pass but dropped —
// neither ships a DevTools tab in the versions tested. See ../REPORTS.md.
// See ../README.md for the runbook. This directory is the living
// implementation of the "ecosystem dogfooding" workstream (see
// nuxt/devtools#1022) and is now its source of truth.
//
// `@nuxt/devtools` (package.json) is a `link:../../packages/devtools`
// dependency — this repo's own build, never the npm registry — so both
// branches below test this repo's code, just two different builds of it:
// `../../local` spawns a live `nuxi dev` subprocess for the devtools client
// (HMR, for iterating on client code); the plain `@nuxt/devtools` import
// resolves through that link to whatever's currently in
// `packages/devtools/dist` (stub via `pnpm run prepare`, or a full static
// client via `pnpm run build`).
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'

export default defineNuxtConfig({
  modules: [
    devtoolsModule,
    // Original trio
    'nuxt-og-image',
    '@nuxt/scripts',
    '@nuxt/fonts',
    // Devtools-category set
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/a11y',
    '@compodium/nuxt',
    '@scalar/nuxt',
  ],

  css: ['~/assets/main.css'],

  // @scalar/nuxt renders its API reference (and its DevTools "Scalar" tab)
  // from Nitro's auto-generated OpenAPI document — see server/api/*.ts, which
  // carry `defineRouteMeta({ openAPI: … })` so the spec isn't empty. The spec
  // is served at `/_openapi.json`.
  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  routeRules: {
    // @scalar/nuxt's `/docs` page (also what its DevTools "Scalar" tab embeds)
    // fails to SSR under this Nuxt 4.5 / Vite 8 stack — it throws "Cannot
    // destructure property 'mod' of 'threads.workerData'". The API reference is
    // a client-rendered app, so serving it as SPA sidesteps the SSR crash
    // without losing any functionality.
    '/docs/**': { ssr: false },
  },

  compatibilityDate: '2024-09-19',
})
