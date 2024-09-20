import { createResolver } from 'nuxt/kit'
import DevToolsUiKit from '../../devtools-ui-kit/src/module'
import DevTools from '../src/module'

const resolver = createResolver(import.meta.url)

const packageBundles = [
  'quicktype-core',
  'shiki',
]

export default defineNuxtConfig({
  modules: [
    '@nuxt/test-utils/module',
    '~/modules/markdown',
    DevToolsUiKit,
    DevTools,
    '@nuxt/eslint',
    'nuxt-eslint-auto-explicit-import',
  ],

  ssr: false,

  nitro: {
    output: {
      publicDir: resolver.resolve('../dist/client'),
    },
    devStorage: {
      test: {
        driver: 'fs',
        base: resolver.resolve('./.data/test'),
      },
    },
    hooks: {
      'prerender:routes': function (routes) {
        // Disable prerendering as it's an SPA
        routes.clear()
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

  alias: {
    '@nuxt/devtools-kit/iframe-client': resolver.resolve('../../devtools-kit/src/runtime/iframe-client'),
    '@nuxt/devtools-kit/types': resolver.resolve('../../devtools-kit/src/types'),
    '@nuxt/devtools-kit': resolver.resolve('../../devtools-kit/src/index'),
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

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

  app: {
    baseURL: '/__nuxt_devtools__/client/',
  },

  experimental: {
    watcher: 'parcel',
  },

  vite: {
    warmupEntry: false,
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks(id) {
            const pkg = packageBundles.find(pkg => id.includes(`node_modules/${pkg}`))
            if (pkg) {
              return pkg
            }

            // if (id.includes('.nuxt/routes'))
            //   return 'routes'

            // if (id.includes('.nuxt'))
            //   console.log(id)
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
        'vis-data',
        'vis-network',
        'vue-virtual-scroller',
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

  // Production Overrides
  $production: {
    app: {
      // We set a placeholder for the middleware to be replaced with the correct base URL
      baseURL: '/__NUXT_DEVTOOLS_BASE__/',
    },
  },

  compatibilityDate: '2024-07-22',
})
