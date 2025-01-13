import type { DevToolsFrameState } from '~~/../src/types'
import { useLocalStorage, useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

export const isFirstVisit = useLocalStorage('nuxt-devtools-first-visit', true)

const windowSize = useWindowSize()

export const splitScreenAvailable = computed(() => windowSize.width.value > 1080)
export const splitScreenEnabled = useLocalStorage('nuxt-devtools-split-screen', false)
export const splitScreenView = useLocalStorage('nuxt-devtools-split-screen-view', 'overview')

const devToolsFrameState = useLocalStorage<DevToolsFrameState>('nuxt-devtools-frame-state', {} as any, { listenToStorageChanges: true })
const devToolsPanelsState = useLocalStorage<Record<string, number>>('nuxt-devtools-panels-state', {} as any, { listenToStorageChanges: false })

export function useDevToolsFrameState() {
  return devToolsFrameState
}

export function useDevToolsPanelsState() {
  return devToolsPanelsState
}
