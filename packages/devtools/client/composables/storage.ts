import { toRefs } from '@vueuse/core'
import type { DevToolsFrameState, DevToolsUISettings } from '~~/../src/types'

export const isFirstVisit = useLocalStorage('nuxt-devtools-first-visit', true)

const devToolsSettings = useLocalStorage<DevToolsUISettings>('nuxt-devtools-settings', {
  componentsView: 'list',
  componentsGraphShowNodeModules: false,
  componentsGraphShowPages: false,
  componentsGraphShowLayouts: false,
  componentsGraphShowWorkspace: true,
  interactionCloseOnOutsideClick: false,
  showExperimentalFeatures: false,
}, { mergeDefaults: true })

const devToolsSettingsRefs = toRefs(devToolsSettings)

const devToolsFrameState = useLocalStorage<DevToolsFrameState>('nuxt-devtools-frame-state', {} as any, { listenToStorageChanges: false })

export function useDevToolsSettings() {
  return devToolsSettingsRefs
}

export function useDevToolsFrameState() {
  return devToolsFrameState
}
