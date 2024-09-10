import { debounce } from 'perfect-debounce'
import type { Nitro } from 'nitropack'
import type { NuxtDevtoolsServerContext, ServerFunctions, ServerRouteInfo } from '../types'

export function setupServerRoutesRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let nitro: Nitro

  let cache: ServerRouteInfo[] | null = null

  const refreshDebounced = debounce(() => {
    cache = null
    refresh('getServerRoutes')
  }, 500)

  nuxt.hook('nitro:init', (_) => {
    nitro = _
    cache = null
    refresh('getServerRoutes')
  })

  nuxt.hook('ready', () => {
    nitro?.storage.watch((event, key) => {
      if (key.startsWith('src:api:') || key.startsWith('src:routes:'))
        refreshDebounced()
    })
  })

  function scan() {
    if (cache)
      return cache

    cache = (() => {
      if (!nitro)
        return []
      return [
        ...nitro.scannedHandlers
          .filter(item => !item.middleware)
          .map(item => ({
            route: item.route,
            filepath: item.handler,
            method: item.method,
            type: item.route?.startsWith('/api') ? 'api' : 'route',
          })),
        ...nitro.options.handlers.filter(item => !item.route?.startsWith('/_nitro') && !item.route?.startsWith('/__nuxt') && !item.middleware).map(item => ({
          route: item.route,
          filepath: item.handler,
          method: item.method,
          type: 'runtime',
        })),
      ] as ServerRouteInfo[]
    })()

    return cache
  }

  return {
    getServerRoutes() {
      return scan()
    },
  } satisfies Partial<ServerFunctions>
}
