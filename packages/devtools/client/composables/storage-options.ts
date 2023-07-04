import { toRefs } from '@vueuse/core'

// Server Routes
const serverRouteOptions = ref(await rpc.getOptions('serverRoutes'))
const serverRoutes = toRefs(serverRouteOptions)

const list = {
  serverRoutes,
}

export function useDevToolsOptions<T extends keyof typeof list>(tab: T) {
  return list[tab]
}

// Server Routes
watch(serverRouteOptions, async (options) => {
  rpc.updateOptions('serverRoutes', options)
}, { deep: true, flush: 'post' })
