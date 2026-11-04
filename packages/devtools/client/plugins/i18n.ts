import { watch } from 'vue'
import { defineNuxtPlugin } from '#imports'
import { useDevToolsLocale } from '../composables/locale'
import { i18n, setLocale } from '../i18n'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(i18n)

  const locale = useDevToolsLocale()
  // Load the initial locale before the first render to avoid an English flash.
  await setLocale(locale.value)
  watch(locale, value => setLocale(value))
})
