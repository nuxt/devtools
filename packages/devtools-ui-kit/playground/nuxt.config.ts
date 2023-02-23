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
  // Workaround for vercel deployment detecting nitro output
  srcDir: __dirname,
  rootDir: resolve(__dirname, '../../..'),
  modules: [
    DevtoolsUIKit,
  ],
  devtoolsUIKit: {
    dev: true,
  },
  unocss: {
    preflight: true,
    configFile: resolve(__dirname, '../unocss.config.ts'),
  },
})
