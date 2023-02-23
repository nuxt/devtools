import { ref } from 'vue'
import type { DevToolsFrameState, DevToolsUISettings } from '../../../types'
import { useObjectStorage } from './utils'

export const PANEL_PADDING = 10
export const PANEL_MIN = 15
export const PANEL_MAX = 100

export type ViewMode = 'default' | 'component-inspector'

export const viewMode = ref<ViewMode>('default')

export const state = useObjectStorage<DevToolsFrameState>('nuxt-devtools-frame-state', {
  width: 80,
  height: 60,
  bottom: 0,
  left: 0,
  open: false,
  route: '/',
  position: 'bottom',
})

export const settings = useObjectStorage<DevToolsUISettings>('nuxt-devtools-settings', {} as any, true)

export function togglePanel() {
  if (state.value.open)
    closePanel()
  else
    openPanel()
}

export function closePanel() {
  if (viewMode.value !== 'default')
    viewMode.value = 'default'
  else
    state.value.open = false
}

export function openPanel() {
  state.value.open = true
}
