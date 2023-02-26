import { resolve } from 'path'

import DevTools from '../src/module'
import DevToolsUiKit from '../../devtools-ui-kit/src/module'

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
      publicDir: resolve(__dirname, '../dist/client'),
    },
  },
  css: [
    'splitpanes/dist/splitpanes.css',
  ],
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
