// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '../../packages/devtools-ui-kit/src/module',
    '../../local',
    './modules/custom-module',
  ],
})
