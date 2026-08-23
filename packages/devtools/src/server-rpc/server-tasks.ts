import type { NuxtDevtoolsServerContext, ScannedNitroTasks, ServerFunctions } from '../types'
import type { AnyNitro } from '../utils/nitro-compat'
import { debounce } from 'perfect-debounce'

export function setupServerTasksRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let nitro: AnyNitro | undefined
  let unhookDevReload: (() => void) | undefined

  let cache: ScannedNitroTasks | null = null

  const refreshDebounced = debounce(() => {
    cache = null
    refresh('getServerTasks')
  }, 500)

  nuxt.hook('nitro:init', (_nitro: AnyNitro) => {
    nitro = _nitro
    cache = null
    refresh('getServerTasks')

    // See the equivalent comment in `server-routes.ts`: this used to watch
    // Nitro's internal `src` storage mount, which Nitro v3 no longer exposes.
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
      if (!nitro) {
        return {
          tasks: {},
          scheduledTasks: {},
        }
      }
      return {
        // Nitro v3's task config types `handler`/`description` as optional
        // (they're always populated in practice by Nitro's own task scanner),
        // so normalize with fallbacks to satisfy `ScannedNitroTasks`.
        tasks: Object.fromEntries(
          Object.entries(nitro.options.tasks ?? {}).map(([name, task]) => [
            name,
            { handler: task.handler ?? '', description: task.description ?? '' },
          ]),
        ),
        scheduledTasks: Object.entries(nitro.options.scheduledTasks ?? {})
          .reduce<Record<string, string[]>>((acc, [cron, tasks]) => {
            acc[cron] = Array.isArray(tasks) ? tasks : [tasks]
            return acc
          }, {}),
      }
    })()

    return cache
  }

  return {
    getServerTasks() {
      return scan()
    },
  } satisfies Partial<ServerFunctions>
}
