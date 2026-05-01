// https://nuxt.com/docs/api/configuration/nuxt-config
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'

export default defineNuxtConfig({
  modules: [
    devtoolsModule,
  ],

  compatibilityDate: '2024-09-19',
})
