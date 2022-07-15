import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt'
// eslint-disable-next-line
import DevTools from '../src/module'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '~/modules/custom-tabs',
    DevTools
  ],
  ssr: false,
  experimental: {
    reactivityTransform: true
  },
  pages: true,
  nitro: {
    output: {
      publicDir: resolve(__dirname, '../dist/client')
    }
  },
  alias: {
    // we are not using them, alias to anything to avoid bundler going to node specific modules
    '@iconify/utils/lib/loader/node-loader': 'vue',
    '@iconify/utils/lib/loader/node-loader.cjs': 'vue'
  },
  app: {
    baseURL: '/__nuxt_devtools__/client'
  },
  vite: {
    build: {
      target: 'esnext'
    },
    optimizeDeps: {
      include: ['debug'],
      exclude: ['@iconify/utils', '@unocss/plugins-icons']
    }
  }
})
