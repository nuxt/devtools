export default defineNuxtConfig({
  extends: ['docus'],

  routeRules: {
    '/guide': { redirect: '/guide/getting-started' },
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/plausible',
    ...(process.env.CI ? [] : ['../local']),
  ],

  site: {
    name: 'Nuxt Devtools',
    url: 'https://devtools.nuxt.com',
  },

  content: {
    experimental: {
      sqliteConnector: 'native',
    },
  },

  // hooks: {
  //   // Related to https://github.com/nuxt/nuxt/pull/22558
  //   // Adding all global components to the main entry
  //   // To avoid lagging during page navigation on client-side
  //   'components:extend': function (components) {
  //     for (const comp of components) {
  //       if (comp.global)
  //         comp.global = 'sync'
  //     }
  //   },
  // },

  $production: {
    nitro: {
      experimental: {
        wasm: true,
      },
    },
  },

  compatibilityDate: '2025-08-07',

  llms: {
    domain: 'https://devtools.nuxt.com',
    title: 'Nuxt Devtools',
    description: 'The Nuxt DevTools gives you insights and transparency about your Nuxt App. Identify performance gaps and seamlessly manage your app configurations.',
    notes: [
      'The documentation only includes Nuxt Devtools docs.',
      'The content is automatically generated from the same source as the official documentation.',
    ],
    full: {
      title: 'Complete Documentation',
      description: 'The complete documentation including all content',
    },
  },
})
