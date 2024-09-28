import { createResolver } from '@nuxt/kit'

const resolver = createResolver(import.meta.url)

export default defineNuxtConfig({
  css: ['~/assets/main.css'],

  modules: [
    '../../packages/devtools-ui-kit/src/module',
    '../../local',
    '@pinia/nuxt',
  ],

  imports: {
    dirs: ['./stores'],
    // TODO: remove this once repo update to use nuxt version with directives folder support
    presets: [{
      from: resolver.resolve('directives/focus.ts'),
      imports: [{
        name: 'Focus',
        meta: {
          vueDirective: true,
        },
      }],
    }],
    // TODO: remove this once repo update to use nuxt version with directives folder support
    addons: {
      vueDirectives: true,
    },
  },

  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
})
