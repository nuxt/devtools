import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import '@unocss/nuxt'
import type { ModuleOptions } from '../src/module'
import DevtoolsUIKit from '../src/module'

declare module 'nuxt/schema' {
  interface NuxtConfig {
    devtoolsUIKit: ModuleOptions
  }
}

export default defineNuxtConfig({
  modules: [
    DevtoolsUIKit,
  ],
  devtoolsUIKit: {
    dev: true,
  },
  nitro: {
    rootDir: resolve(__dirname, '../../..'),
  },
  unocss: {
    preflight: true,
    configFile: resolve(__dirname, '../unocss.config.ts'),
  },
})
