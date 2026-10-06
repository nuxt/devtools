// https://nuxt.com/docs/api/configuration/nuxt-config
// `@nuxt/devtools-onboard` is the entry point Nuxt 5 ships; it loads the
// installed `@nuxt/devtools`, so this playground covers that hand-off.
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools-onboard'

export default defineNuxtConfig({
  modules: [
    devtoolsModule,
  ],

  // The Code Server e2e sets a deliberately missing binary so its install
  // state is deterministic even on contributor machines with code-server.
  devtools: process.env.NUXT_DEVTOOLS_CODE_SERVER_BIN
    ? { codeServer: { bin: process.env.NUXT_DEVTOOLS_CODE_SERVER_BIN } }
    : undefined,

  compatibilityDate: '2024-09-19',
})
