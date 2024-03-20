export default defineNuxtConfig({
  css: ['~/assets/main.css'],

  modules: [
    '../../packages/devtools-ui-kit/src/module',
    '../../local',
    '@pinia/nuxt',
  ],

  imports: {
    dirs: ['./stores'],
  },

  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
})
