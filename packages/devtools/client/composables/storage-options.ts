import { toRefs, watchDebounced } from '@vueuse/core'

// Assets
const assetsOptions = ref(await rpc.getOptions('assets'))
const assets = toRefs(assetsOptions)

watchDebounced(assetsOptions, async (options) => {
  rpc.updateOptions('assets', options)
}, { deep: true, flush: 'post', debounce: 500, maxWait: 1000 })

// Server Routes
const serverRouteOptions = ref(await rpc.getOptions('serverRoutes'))
const serverRoutes = toRefs(serverRouteOptions)

watchDebounced(serverRouteOptions, async (options) => {
  rpc.updateOptions('serverRoutes', options)
}, { deep: true, flush: 'post', debounce: 500, maxWait: 1000 })

// Server Tasks
const serverTasksOptions = ref(await rpc.getOptions('serverTasks'))
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

export function useDevToolsOptions<T extends keyof typeof list>(tab: T) {
  return list[tab]
}
