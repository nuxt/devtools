import { resolve } from 'path'

import DevTools from '../src/module'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '~/modules/custom-tabs',
    DevTools,
  ],
  ssr: false,
  experimental: {
    reactivityTransform: true,
  },
  pages: true,
  nitro: {
    output: {
      publicDir: resolve(__dirname, '../dist/client'),
    },
  },
  app: {
    baseURL: '/__nuxt_devtools__/client',
  },
  vite: {
    build: {
      target: 'esnext',
    },
  },
})
