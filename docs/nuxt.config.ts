export default defineNuxtConfig({
  extends: '@nuxt/ui-pro',

  routeRules: {
    '/guide': { redirect: '/guide/getting-started' },
  },

  modules: [
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxthq/studio',
    '@vueuse/nuxt',
    '@nuxtjs/plausible',
    'nuxt-og-image',
    ...(process.env.CI ? [] : ['../local']),
  ],

  colorMode: {
    preference: 'dark',
  },

  site: {
    url: 'https://devtools.nuxt.com',
  },

  ui: {
    icons: ['heroicons', 'simple-icons', 'ph'],
  },

  nitro: {
    prerender: {
      routes: ['/api/search.json'],
      autoSubfolderIndex: false,
    },
  },

  hooks: {
    // Related to https://github.com/nuxt/nuxt/pull/22558
    // Adding all global components to the main entry
    // To avoid lagging during page navigation on client-side
    'components:extend': function (components) {
      for (const comp of components) {
        if (comp.global)
          comp.global = 'sync'
      }
    },
  },

  // devtools: {
  //   enabled: true,
  //   componentInspector: {
  //     cleanHtml: false,
  //   },
  // },

  $production: {
    nitro: {
      experimental: {
        wasm: true,
      },
    },
  },
})
