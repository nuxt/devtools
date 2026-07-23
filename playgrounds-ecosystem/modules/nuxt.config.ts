// https://nuxt.com/docs/api/configuration/nuxt-config
//
// Ecosystem dogfooding playground — combines three popular Nuxt modules
// (nuxt-og-image, @nuxt/scripts, @nuxt/fonts), wired to the LOCAL
// @nuxt/devtools, to verify their Nuxt DevTools integrations (see
// ../REPORTS.md for the findings). @nuxt/content and @nuxt/image were tried
// too but dropped — neither ships a DevTools tab in the versions tested, so
// there was nothing to dogfood against; see ../REPORTS.md for that finding.
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
    'nuxt-og-image',
    '@nuxt/scripts',
    '@nuxt/fonts',
  ],

  css: ['~/assets/main.css'],

  compatibilityDate: '2024-09-19',
})
