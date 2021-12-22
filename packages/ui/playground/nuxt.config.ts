import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt3'
import '@unocss/nuxt'
import NuxtUI from '../src/nuxt'

export default defineNuxtConfig({
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
