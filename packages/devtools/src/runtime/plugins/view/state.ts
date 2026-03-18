import type { DevToolsFrameState } from '@nuxt/devtools/types'
import { useObjectStorage } from './utils'

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
