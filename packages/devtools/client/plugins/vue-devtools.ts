import { VueDevToolsVuePlugin } from '@vue/devtools-core'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDevToolsVuePlugin())
})
