import type { DevToolsFrameState, DevToolsUISettings } from '~~/../src/types'

export const isFirstVisit = useLocalStorage('nuxt-devtools-first-visit', true)

export const devToolsSettings = useLocalStorage<DevToolsUISettings>('nuxt-devtools-settings', {
  customTabs: true,
}, { mergeDefaults: true })

export const devToolsFrameState = useLocalStorage<DevToolsFrameState>('nuxt-devtools-frame-state', {} as any)
