import { createResolver } from 'nuxt/kit'
import DevToolsUiKit from '../../devtools-ui-kit/src/module'
import DevTools from '../src/module'

const resolver = createResolver(import.meta.url)

const packageBundles = {
  'shiki': ['shiki', '@shikijs'],
  'quicktype-core': ['quicktype-core'],
  'json-editor-vue': ['json-editor-vue', 'ajv', 'vanilla-picker', 'vanilla-jsoneditor'],
  'xterm': ['xterm', '@xterm'],
  'vis': ['vis-data', 'vis-network'],
  'unocss': ['@unocss', 'unocss'],
  'markdown-it': ['markdown-it'],
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/test-utils/module',
    '~/modules/markdown',
    DevToolsUiKit,
    DevTools,
    '@nuxt/eslint',
    'nuxt-eslint-auto-explicit-import',
  ],

  // For dogfooding purposes
  $development: {
    appConfig: {
      fixture2: 'from nuxt.config.ts',
    },

    runtimeConfig: {
      'fixture3': 'private runtime config from nuxt.config.ts',
      'api-key': 'null',
      'public': {
        fixture4: 'public runtime config from nuxt.config.ts',
      },
    },

    nitro: {
      devStorage: {
        test: {
          driver: 'fs',
          base: resolver.resolve('./.data/test'),
        },
      },
      experimental: {
        tasks: true,
      },
      scheduledTasks: {
        '*/5 * * * *': ['collection:1', 'collection:2'],
        '*/30 * * * *': ['ping'],
      },
    },
  },

  // Production Overrides
  $production: {
    app: {
      // We set a placeholder for the middleware to be replaced with the correct base URL
      baseURL: '/__NUXT_DEVTOOLS_BASE__/',
    },
  },

  ssr: false,

  app: {
    baseURL: '/__nuxt_devtools__/client/',
  },

  alias: {
    '@nuxt/devtools-kit/iframe-client': resolver.resolve('../../devtools-kit/src/runtime/iframe-client'),
    '@nuxt/devtools-kit/types': resolver.resolve('../../devtools-kit/src/types'),
    '@nuxt/devtools-kit': resolver.resolve('../../devtools-kit/src/index'),
  },

  experimental: {
    watcher: 'parcel',
  },

  compatibilityDate: '2024-07-22',

  nitro: {
    output: {
      publicDir: resolver.resolve('../dist/client'),
    },

    hooks: {
      'prerender:routes': function (routes) {
        // Disable prerendering as it's an SPA
        routes.clear()
      },
    },
  },

  vite: {
    warmupEntry: false,
    $client: {
      build: {
        target: 'esnext',
        rollupOptions: {
          output: {
            chunkFileNames(chunkInfo) {
              const kebabName = chunkInfo.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
              return `_nuxt/${kebabName}-[hash].js`
            },
            assetFileNames(assetInfo) {
              const kebabName = (assetInfo.name || '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
              return `_nuxt/${kebabName}-[hash][extname]`
            },
            manualChunks(id) {
              for (const bundle of Object.entries(packageBundles)) {
                if (bundle[1].some(pkg => id.includes(`node_modules/${pkg}/`)))
                  return `vendor/${bundle[0]}`
              }
            },
            hashCharacters: 'base36',
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        '@unocss/preset-icons/browser',
        '@unocss/runtime',
        'cronstrue',
        'diff',
        'error-stack-parser-es',
        'fuse.js',
        'json-editor-vue',
        'ohash',
        'perfect-debounce',
        'scule',
        'vue-virtual-scroller',
        'vis-data',
        'vis-network',
        '@vue/devtools-applet',
        '@xterm/xterm',
        '@xterm/addon-fit',
      ],
    },
    server: {
      hmr: {
        clientPort: process.env.PORT ? +process.env.PORT : undefined,
      },
    },
  },

  typescript: {
    includeWorkspace: true,
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },
})
