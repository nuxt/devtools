import { resolve } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'
import '@unocss/nuxt'
import DevtoolsUIKit from '../src/module'

export default defineNuxtConfig({
  modules: [
    DevtoolsUIKit,
  ],
  devtoolsUIKit: {
    dev: true,
  },
  nitro: {
    rootDir: resolve(__dirname, '..'),
  },
  unocss: {
    preflight: true,
    configFile: resolve(__dirname, '../unocss.config.ts'),
  },
  alias: {
    '@nuxt/devtools-kit/iframe-client': resolve(__dirname, './stub/iframe-client.ts'),
  },
})
