import type { NuxtDevtoolsServerContext, ServerFunctions, ServerRouteInfo } from '../types'
import type { AnyNitro } from '../utils/nitro-compat'
import { debounce } from 'perfect-debounce'

export function setupServerRoutesRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let nitro: AnyNitro | undefined
  let unhookDevReload: (() => void) | undefined

  let cache: ServerRouteInfo[] | null = null

  const refreshDebounced = debounce(() => {
    cache = null
    refresh('getServerRoutes')
  }, 500)

  nuxt.hook('nitro:init', (_nitro: AnyNitro) => {
    nitro = _nitro
    cache = null
    refresh('getServerRoutes')

    // Re-scan whenever Nitro reloads (new/changed server route files). This
    // used to watch Nitro's internal `src` storage mount for finer-grained
    // `src:api:`/`src:routes:` key events, but Nitro v3 dropped the `.storage`
    // runtime property that made that mount reachable. `dev:reload` exists on
    // both Nitro v2 and v3 and fires on any server-dir change, which is a
    // coarser signal but debounced re-scans are cheap either way.
    unhookDevReload?.()
    unhookDevReload = _nitro.hooks.hook('dev:reload', () => refreshDebounced())
  })

  nuxt.hook('close', () => {
    unhookDevReload?.()
    unhookDevReload = undefined
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
