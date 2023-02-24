import { resolve } from 'path'
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
})
