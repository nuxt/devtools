import { ref, shallowRef, watch } from 'vue'
import type { DevToolsFrameState } from '../../../types'
import { useObjectStorage } from './utils'

export const PANEL_PADDING = 10
export const PANEL_MIN = 20
export const PANEL_MAX = 100

export const popupWindow = shallowRef<Window | null>(null)

export const state = useObjectStorage<DevToolsFrameState>('nuxt-devtools-frame-state', {
  width: 80,
  height: 60,
  top: 0,
  left: 50,
  open: false,
  route: '/',
  position: 'bottom',
  closeOnOutsideClick: false,
})

export const isInitialized = ref(state.value.open)
if (!isInitialized.value) {
  watch(() => state.value.open, (open) => {
    if (open)
      isInitialized.value = open
  })
}

export function togglePanel() {
  if (state.value.open)
    closePanel()
  else
    openPanel()
}

export function closePanel() {
  state.value.open = false
  if (popupWindow.value) {
    popupWindow.value.close()
    popupWindow.value = null
  }
}

export function openPanel() {
  state.value.open = true
}
