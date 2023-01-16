import { resolve } from 'path'

import DevTools from '../src/module'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '~/modules/custom-tabs',
    DevTools,
  ],
  css: [
    '~/styles/global.css',
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
  devtools: {
    vscodeServer: true,
  },
  runtimeConfig: {
    public: {
      NUXT_DEVTOOLS_OPEN: true,
    },
  },
  app: {
    baseURL: '/__nuxt_devtools__/client',
  },
  vite: {
    define: {
      'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
    },
    build: {
      target: 'esnext',
    },
  },
})
