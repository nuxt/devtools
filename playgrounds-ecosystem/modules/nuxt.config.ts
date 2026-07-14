// https://nuxt.com/docs/api/configuration/nuxt-config
//
// Ecosystem dogfooding playground — combines five popular Nuxt modules
// (nuxt-og-image, @nuxt/scripts, @nuxt/content, @nuxt/fonts, @nuxt/image),
// wired to the LOCAL @nuxt/devtools, to verify which of them still have a
// working Nuxt DevTools integration (see ../REPORTS.md for the findings —
// spoiler: 3 of 5 do). See ../README.md for the runbook and
// ../../plans/vite-devtools-integration/04-ecosystem-playgrounds.md for the
// plan this implements.
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'

export default defineNuxtConfig({
  modules: [
    devtoolsModule,
    '@nuxt/content',
    'nuxt-og-image',
    '@nuxt/scripts',
    '@nuxt/fonts',
    '@nuxt/image',
  ],

  css: ['~/assets/main.css'],

  content: {
    // Avoids the better-sqlite3/sqlite3 native build step in this sandboxed
    // opt-in workspace — uses Node's built-in `node:sqlite` (Node >= 22.5).
    experimental: { sqliteConnector: 'native' },
  },

  compatibilityDate: '2024-09-19',
})
