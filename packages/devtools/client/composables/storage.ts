import { toRefs } from '@vueuse/core'
import type { DevToolsFrameState } from '~~/../src/types'

export const isFirstVisit = useLocalStorage('nuxt-devtools-first-visit', true)

export const splitScreenEnabled = useLocalStorage('nuxt-devtools-split-screen', false)
export const splitScreenView = useLocalStorage('nuxt-devtools-split-screen-view', 'overview')

const devToolsFrameState = useLocalStorage<DevToolsFrameState>('nuxt-devtools-frame-state', {} as any, { listenToStorageChanges: true })

const devToolsPanelsState = useLocalStorage<Record<string, number>>('nuxt-devtools-panels-state', {} as any, { listenToStorageChanges: false })

const uiOptions = ref(await rpc.getOptions('ui'))
const uiOptionsRefs = toRefs(uiOptions)

watch(uiOptions, async (options) => {
  rpc.updateOptions('ui', options)
}, { deep: true, flush: 'post' })

// sync devtools options with frame state
watchEffect(() => {
  devToolsFrameState.value.closeOnOutsideClick = uiOptions.value.interactionCloseOnOutsideClick
})

// Migrate settings from localStorage to devtools options. TODO: remove in next major release
if (localStorage.getItem('nuxt-devtools-settings')) {
  Object.assign(uiOptions.value, JSON.parse(localStorage.getItem('nuxt-devtools-settings')!))
  localStorage.removeItem('nuxt-devtools-settings')
}

export function useDevToolsUIOptions() {
  return uiOptionsRefs
}

export function useDevToolsFrameState() {
  return devToolsFrameState
}

export function useDevToolsPanelsState() {
  return devToolsPanelsState
}
