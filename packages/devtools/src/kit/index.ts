import { useNuxt } from '@nuxt/kit'
import type { ModuleCustomTab } from '../types'
import type {} from '../hooks'

/**
 * Hooks to extend a custom tab in devtools.
 *
 * Provide a function to pass a factory that can be updated dynamically.
 */
export function addCustomTab(tab: ModuleCustomTab | (() => ModuleCustomTab | Promise<ModuleCustomTab>), nuxt = useNuxt()) {
  nuxt.hook('devtools:customTabs', async (tabs) => {
    if (typeof tab === 'function')
      tab = await tab()
    tabs.push(tab)
  })
}

/**
 * Retrigger update for custom tabs, `devtools:customTabs` will be called again.
 */
export function refreshCustomTabs(nuxt = useNuxt()) {
  return nuxt.callHook('devtools:customTabs:refresh')
}
