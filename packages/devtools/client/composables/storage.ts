import { toRefs } from '@vueuse/core'
import type { DevToolsFrameState, NuxtDevToolsUIOptions } from '~~/../src/types'

export const isFirstVisit = useLocalStorage('nuxt-devtools-first-visit', true)

const devToolsFrameState = useLocalStorage<DevToolsFrameState>('nuxt-devtools-frame-state', {} as any, { listenToStorageChanges: false })

const devToolsPanelsState = useLocalStorage<Record<string, number>>('nuxt-devtools-panels-state', {} as any, { listenToStorageChanges: false })

const devToolsOptions = ref<NuxtDevToolsUIOptions>(await rpc.getUIOptions())
const devToolsOptionsRefs = toRefs(devToolsOptions)

watch(devToolsOptions, async (options) => {
  rpc.updateUIOptions(options)
}, { deep: true, flush: 'post' })

// sync devtools options with frame state
watchEffect(() => {
  devToolsFrameState.value.closeOnOutsideClick = devToolsOptions.value.interactionCloseOnOutsideClick
})

// Migrate settings from localStorage to devtools options. TODO: remove in next major release
if (localStorage.getItem('nuxt-devtools-settings')) {
  Object.assign(devToolsOptions.value, JSON.parse(localStorage.getItem('nuxt-devtools-settings')!))
  localStorage.removeItem('nuxt-devtools-settings')
}

export function useDevToolsOptions() {
  return devToolsOptionsRefs
}

export function useDevToolsFrameState() {
  return devToolsFrameState
}

export function useDevToolsPanelsState() {
  return devToolsPanelsState
}
