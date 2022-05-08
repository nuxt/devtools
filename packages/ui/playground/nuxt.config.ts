import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt'
import '@unocss/nuxt'
import NuxtUI from '../src/nuxt'

export default defineNuxtConfig({
  // Workaround for vercel deployment detecting nitro output
  srcDir: __dirname,
  rootDir: resolve(__dirname, '../../..'),

  buildModules: [
    NuxtUI
  ],
  nui: {
    dev: true
  },
  unocss: {
    preflight: true,
    configFile: resolve(__dirname, '../unocss.config.ts')
  }
})
