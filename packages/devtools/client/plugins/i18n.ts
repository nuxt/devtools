import { watch } from 'vue'
import { defineNuxtPlugin } from '#imports'
import { useDevToolsLocale } from '../composables/locale'
import { i18n } from '../i18n'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(i18n)

  const locale = useDevToolsLocale()
  watch(locale, (value) => {
    i18n.global.locale.value = value
    if (typeof document !== 'undefined')
      document.documentElement.lang = value
  }, { immediate: true })
})
