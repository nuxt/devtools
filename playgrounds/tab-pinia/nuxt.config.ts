import { createResolver } from '@nuxt/kit'

const resolver = createResolver(import.meta.url)

const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'

export default defineNuxtConfig({
  css: ['~/assets/main.css'],

  modules: [
    '../../packages/devtools-ui-kit/src/module',
    devtoolsModule,
    '@pinia/nuxt',
  ],

  imports: {
    dirs: ['./stores'],
    presets: [{
      from: resolver.resolve('directives/focus.ts'),
      imports: [{
        name: 'Focus',
        meta: {
          vueDirective: true,
          docsUrl: 'https://vuetifyjs.com/en/directives/click-outside/#usage',
          description: 'The v-focus directive focus the element once mounted.',
        },
      }],
    }],
    addons: {
      vueDirectives: true,
    },
  },

  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },

  vite: {
    optimizeDeps: {
      // Pre-bundle deps `@pinia/nuxt` pulls in directly, so the Vue DevTools
      // applet in the Pinia tab doesn't trigger a page reload mid-test.
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
  },

  compatibilityDate: '2025-03-25',
})
