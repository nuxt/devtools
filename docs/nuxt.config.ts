export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  modules: [
    '@nuxtjs/plausible',
    ...(process.env.CI ? [] : ['../local']),
  ],
  css: [
    '~/style.css',
  ],
})
