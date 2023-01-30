export const isFirstVisit = useLocalStorage('nuxt-devtools-first-visit', true)

export const devToolsSettings = useLocalStorage('nuxt-devtools-settings', {
  customTabs: true,
}, { mergeDefaults: true })

export interface DevToolsSettings {
  customTabs: boolean
}
