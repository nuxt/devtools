// The app the docs screenshots are taken from (`pnpm docs:screenshots`):
// a small shop, so every DevTools tab has something realistic to show.
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'

export default defineNuxtConfig({
  modules: [
    devtoolsModule,
    '@unocss/nuxt',
    '@vueuse/nuxt',
  ],

  devtools: {
    timeline: {
      enabled: true,
    },
  },

  app: {
    head: {
      title: 'Nuxt Shop',
      htmlAttrs: { lang: 'en', class: 'dark' },
    },
  },

  css: ['~/assets/main.css'],

  runtimeConfig: {
    stripeSecretKey: '',
    public: {
      siteName: 'Nuxt Shop',
      currency: 'EUR',
    },
  },

  nitro: {
    experimental: {
      tasks: true,
    },
    storage: {
      shop: { driver: 'fs', base: './.data/shop' },
    },
  },

  compatibilityDate: '2026-10-01',
})
