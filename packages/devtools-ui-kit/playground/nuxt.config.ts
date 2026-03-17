import { defineNuxtConfig } from 'nuxt/config'
import { createResolver } from 'nuxt/kit'
import DevtoolsUIKit from '../src/module'
import '@unocss/nuxt'

const resolver = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    DevtoolsUIKit,
  ],
  devtoolsUIKit: {
    dev: true,
  },
  nitro: {
    rootDir: resolver.resolve('..'),
  },
  unocss: {
    preflight: true,
    configFile: false,
  },
  alias: {
    '@nuxt/devtools-kit/iframe-client': resolver.resolve('./stub/iframe-client.ts'),
  },
})
