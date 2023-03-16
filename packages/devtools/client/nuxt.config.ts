import { resolve } from 'node:path'

import DevTools from '../src/module'
import DevToolsUiKit from '../../devtools-ui-kit/src/module'

const r = (p: string) => resolve(__dirname, p)

export default defineNuxtConfig({
  modules: [
    'nuxt-vitest',
    '~/modules/custom-tabs',
    DevToolsUiKit,
    DevTools,
  ],
  ssr: false,
  pages: true,
  nitro: {
    output: {
      publicDir: r('../dist/client'),
    },
    devStorage: {
      test: {
        driver: 'fs',
        base: r('./.data/test'),
      },
    },
  },
  alias: {
    '@nuxt/devtools-kit/iframe-client': r('../../devtools-kit/src/iframe-client'),
    '@nuxt/devtools-kit/types': r('../../devtools-kit/src/types'),
    '@nuxt/devtools-kit': r('../../devtools-kit/src/index'),
  },
  appConfig: {
    fixture2: 'from nuxt.config.ts',
  },
  runtimeConfig: {
    fixture3: 'private runtime config from nuxt.config.ts',
    public: {
      fixture4: 'public runtime config from nuxt.config.ts',
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
    optimizeDeps: {
      include: [
        'vis-network',
        'vis-data',
      ],
    },
  },
})
