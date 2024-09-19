import type { NuxtDevToolsOptions } from '../../types'
import { toRefs, watchDebounced } from '@vueuse/core'
import { ref } from 'vue'
import { defaultTabOptions } from '../../src/constant'
import { rpc } from './rpc'

let instance: ReturnType<typeof init> | null = null

function init() {
  // Assets
  const assetsOptions = ref<NuxtDevToolsOptions['assets']>(defaultTabOptions.assets)
  rpc.getOptions('assets').then((options) => {
    assetsOptions.value = options
  })
  const assets = toRefs(assetsOptions)

  watchDebounced(assetsOptions, async (options) => {
    rpc.updateOptions('assets', options)
  }, { deep: true, flush: 'post', debounce: 500, maxWait: 1000 })

  // Server Routes
  const serverRouteOptions = ref<NuxtDevToolsOptions['serverRoutes']>(defaultTabOptions.serverRoutes)
  rpc.getOptions('serverRoutes').then((options) => {
    serverRouteOptions.value = options
  })
  const serverRoutes = toRefs(serverRouteOptions)

  watchDebounced(serverRouteOptions, async (options) => {
    rpc.updateOptions('serverRoutes', options)
  }, { deep: true, flush: 'post', debounce: 500, maxWait: 1000 })

  // Server Tasks
  const serverTasksOptions = ref<NuxtDevToolsOptions['serverTasks']>(defaultTabOptions.serverTasks)
  rpc.getOptions('serverTasks').then((options) => {
    serverTasksOptions.value = options
  })
  const serverTasks = toRefs(serverTasksOptions)

  watchDebounced(serverTasksOptions, async (options) => {
    rpc.updateOptions('serverTasks', options)
  }, { deep: true, flush: 'post', debounce: 500, maxWait: 1000 })

  // Options List
  const list = {
    serverRoutes,
    serverTasks,
    assets,
  }

  return list
}

export function useDevToolsOptions<T extends keyof ReturnType<typeof init>>(tab: T) {
  if (!instance) {
    instance = init()
  }
  return instance[tab]
}
