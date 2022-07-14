import { dirname, resolve } from 'path'
import { defineNuxtConfig } from 'nuxt'
// eslint-disable-next-line
import DevTools from '../src/module'
// eslint-disable-next-line
import { presetWebFonts, transformerDirectives } from 'unocss'

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
  unocss: {
    shortcuts: {
      'border-base': 'border-gray/15',
      'bg-base': 'bg-white dark:bg-[#151515]',
      'n-bg-base': 'bg-base',
      'x-divider': 'h-1px w-full bg-gray/15'
    },
    theme: {
      colors: {
        primary: '#03ae67'
      }
    },
    presets: [
      presetWebFonts({
        fonts: {
          sans: 'Inter',
          mono: 'Fira Code'
        }
      })
    ],
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
      'carbon-plug'
    ],
    transformers: [
      transformerDirectives()
    ]
  },
  nitro: {
    output: {
      publicDir: resolve(__dirname, '../dist/client')
    },
    publicAssets: [
      {
        baseURL: '/shiki',
        dir: dirname(require.resolve('shiki'))
      }
    ]
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
