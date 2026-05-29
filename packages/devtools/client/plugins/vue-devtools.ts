import { VueDevToolsVuePlugin } from '@vue/devtools-core'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDevToolsVuePlugin())
})
