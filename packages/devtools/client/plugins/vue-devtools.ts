import { VueDevToolsVuePlugin } from '@vue/devtools-core'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDevToolsVuePlugin())
})
