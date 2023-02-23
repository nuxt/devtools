import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'
import '@unocss/nuxt'
import DevtoolsUIKit from '../src/module'

export default defineNuxtConfig({
  // Workaround for vercel deployment detecting nitro output
  srcDir: __dirname,
  rootDir: resolve(__dirname, '../../..'),
  modules: [
    DevtoolsUIKit,
    '@nuxt/devtools',
  ],
  devtoolsUIKit: {
    dev: true,
  },
  unocss: {
    preflight: true,
    configFile: resolve(__dirname, '../unocss.config.ts'),
  },
})
