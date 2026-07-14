// https://nuxt.com/docs/api/configuration/nuxt-config
//
// Ecosystem dogfooding playground — combines three popular Nuxt modules
// (nuxt-og-image, @nuxt/scripts, @nuxt/fonts), wired to the LOCAL
// @nuxt/devtools, to verify their Nuxt DevTools integrations (see
// ../REPORTS.md for the findings). @nuxt/content and @nuxt/image were tried
// too but dropped — neither ships a DevTools tab in the versions tested, so
// there was nothing to dogfood against; see ../REPORTS.md for that finding.
// See ../README.md for the runbook and
// ../../plans/vite-devtools-integration/04-ecosystem-playgrounds.md for the
// plan this implements.
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
