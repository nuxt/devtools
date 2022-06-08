import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt'
import DevTools from '../src/module'

export default defineNuxtConfig({
  modules: [
    DevTools,
    '@nuxt/ui',
  ],
  ssr: false,
  experimental: {
    reactivityTransform: true,
  },
  pages: true,
  unocss: {
    shortcuts: {
      'border-base': 'border-gray/10',
      'bg-base': 'bg-white dark:bg-[#222]',
    },
    theme: {
      colors: {
        primary: '#03ae67',
      },
    },
    icons: true,
    safelist: [
      'carbon-nominal',
      'carbon-function',
      'carbon-chart-treemap',
      'carbon-3d-mpr-toggle',
      'carbon-tree-view-alt',
      'carbon-information',
    ],
  },
  nitro: {
    output: {
      publicDir: resolve(__dirname, '../dist/client'),
    },
  },
  app: {
    baseURL: '/__nuxt_devtools__/client',
  },
})
