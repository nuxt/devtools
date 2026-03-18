import { version } from '../package.json'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      version,
    },
  },

  modules: [
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@nuxtjs/plausible',
    'nuxt-og-image',
    ...(process.env.CI ? [] : ['../local']),
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'dark',
  },

  routeRules: {
    '/guide': { redirect: '/guide/getting-started' },
  },

  site: {
    url: 'https://devtools.nuxt.com',
  },

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  $production: {
    nitro: {
      experimental: {
        wasm: true,
      },
    },
  },

  compatibilityDate: '2025-02-16',
})
