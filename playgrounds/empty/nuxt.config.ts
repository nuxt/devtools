// https://nuxt.com/docs/api/configuration/nuxt-config
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'

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
