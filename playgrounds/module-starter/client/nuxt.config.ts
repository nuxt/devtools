import { createResolver } from 'nuxt/kit'

const resolver = createResolver(import.meta.url)

export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxt/devtools-ui-kit',
  ],
  nitro: {
    output: {
      publicDir: resolver.resolve('../dist/client'),
    },
  },
  app: {
    baseURL: '/__my-module',
  },
})
