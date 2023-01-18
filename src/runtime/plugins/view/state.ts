import { useObjectStorage } from './utils'

export const PANEL_PADDING = 10
export const PANEL_MIN = 5
export const PANEL_MAX = 100

export interface State {
  width: number
  height: number
  bottom: number
  left: number
  open: boolean
  route: string
}

export type ViewMode = 'default' | 'component-inspector'

export const viewMode = ref<ViewMode>('default')

export const state = useObjectStorage<State>('nuxt-devtools-state', {
  width: 80,
  height: 40,
  bottom: 0,
  left: 0,
  open: false,
  route: '/',
})

export function getFramePosition() {
  const innerWidth = window.innerWidth - PANEL_PADDING * 2
  const innerHeight = window.innerHeight - PANEL_PADDING * 2

  return {
    width: state.value.width * innerWidth / 100,
    height: state.value.height * innerHeight / 100,
    bottom: state.value.bottom * innerHeight / 100 + PANEL_PADDING,
    left: state.value.left * innerWidth / 100 + PANEL_PADDING,
  }
}

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
