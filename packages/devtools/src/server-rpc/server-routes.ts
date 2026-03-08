import type { NitroLike, NuxtDevtoolsServerContext, ServerFunctions, ServerRouteInfo } from '../types'
import { relative, resolve } from 'pathe'
import { debounce } from 'perfect-debounce'

export function setupServerRoutesRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let nitro: NitroLike | undefined

  let cache: ServerRouteInfo[] | null = null

  const refreshDebounced = debounce(() => {
    cache = null
    refresh('getServerRoutes')
  }, 500)

  nuxt.hook('nitro:init', (_: NitroLike) => {
    nitro = _
    cache = null
    refresh('getServerRoutes')
  })

  // Watch for server route file changes
  const serverDir = resolve(nuxt.options.srcDir, nuxt.options.serverDir)
  nuxt.hook('builder:watch', (_event, path) => {
    const absolutePath = resolve(nuxt.options.srcDir, path)
    const rel = relative(serverDir, absolutePath)
    if (!rel.startsWith('..') && (rel.startsWith('api/') || rel.startsWith('routes/'))) {
      refreshDebounced()
    }
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
