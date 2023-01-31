import { toRefs } from '@vueuse/core'
import type { DevToolsFrameState, DevToolsUISettings } from '~~/../src/types'

export const isFirstVisit = useLocalStorage('nuxt-devtools-first-visit', true)

export const devToolsSettings = useLocalStorage<DevToolsUISettings>('nuxt-devtools-settings', {
  customTabs: true,
  componentsView: 'list',
  componentsGraphShowNodeModules: false,
  componentsGraphShowPages: false,
  componentsGraphShowLayouts: false,
}, { mergeDefaults: true })

export const devToolsSettingsRefs = toRefs(devToolsSettings)

export const devToolsFrameState = useLocalStorage<DevToolsFrameState>('nuxt-devtools-frame-state', {} as any, { listenToStorageChanges: false })
