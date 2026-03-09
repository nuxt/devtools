import { defineNuxtConfig } from 'nuxt/config'
import { createResolver } from 'nuxt/kit'
import DevtoolsUIKit from './src/module'
import '@unocss/nuxt'

const resolver = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    DevtoolsUIKit,
    '@nuxtjs/storybook',
  ],
  devtoolsUIKit: {
    dev: true,
  },
  unocss: {
    preflight: true,
    configFile: resolver.resolve('./unocss.config.ts'),
  },
  alias: {
    '@nuxt/devtools-kit/iframe-client': resolver.resolve('./playground/stub/iframe-client.ts'),
  },
})
