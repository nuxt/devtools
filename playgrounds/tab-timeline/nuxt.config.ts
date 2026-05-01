// https://nuxt.com/docs/api/configuration/nuxt-config
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'

export default defineNuxtConfig({
  modules: [
    '../../packages/devtools-ui-kit/src/module',
    devtoolsModule,
  ],
  ssr: true,
  vite: {
    clearScreen: false,
  },
  devtools: {
    enabled: false,
    experimental: {
      timeline: true,
    },
    timeline: {
      functions: {
        includeFrom: [
          '#app',
          '@unhead/vue',
          '@vueuse/core',
        ],
      },

      enabled: true,
    },
  },
})
