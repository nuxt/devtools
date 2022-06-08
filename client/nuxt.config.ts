import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt'
import { presetWebFonts } from 'unocss'
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
      'border-base': 'border-gray/15',
      'bg-base': 'bg-white dark:bg-[#222]',
      'x-divider': 'h-1px w-full bg-gray/15',
    },
    theme: {
      colors: {
        primary: '#03ae67',
      },
    },
    presets: [
      presetWebFonts({
        fonts: {
          sans: 'Inter',
          mono: 'Fira Code',
        },
      }),
    ],
    icons: true,
    safelist: [
      'carbon-nominal',
      'carbon-function',
      'carbon-chart-treemap',
      'carbon-3d-mpr-toggle',
      'carbon-tree-view-alt',
      'carbon-information',
      'carbon-data-set',
      'carbon-layers',
      'carbon-cloud',
      'carbon-plug',
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
  vite: {
    build: {
      target: 'esnext',
    },
  },
})
