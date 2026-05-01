// https://nuxt.com/docs/api/configuration/nuxt-config
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'

export default defineNuxtConfig({
  modules: [
    '../../packages/devtools-ui-kit/src/module',
    devtoolsModule,
  ],
})
