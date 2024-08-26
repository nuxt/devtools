import { shallowRef } from 'vue'
import type { DevToolsFrameState } from '@nuxt/devtools/types'
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
  minimizePanelInactive: 5000,
}, false)
