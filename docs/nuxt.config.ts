export default defineNuxtConfig({
  extends: '@nuxt/ui-pro',

  routeRules: {
    '/guide': { redirect: '/guide/getting-started' }
  },

  modules: [
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxthq/studio',
    '@vueuse/nuxt',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    '@nuxtjs/plausible',
    'nuxt-og-image',
    ...(process.env.CI ? [] : ['../local']),
  ],

  colorMode: {
    preference: 'dark',
  },

  ui: {
    icons: ['heroicons', 'simple-icons', 'ph'],
  },

  fontMetrics: {
    fonts: ['DM Sans'],
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'DM+Sans': [400, 500, 600, 700],
    },
  },

  nitro: {
    prerender: {
      routes: ['/api/search.json'],
      autoSubfolderIndex: false
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
})
