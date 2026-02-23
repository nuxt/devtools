import type { Nitro } from 'nitropack'
import type { NuxtDevtoolsServerContext, ScannedNitroTasks, ServerFunctions } from '../types'
import { debounce } from 'perfect-debounce'
import { watchStorageMount } from './storage-watch'

export function setupServerTasksRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let nitro: Nitro
  let unwatchStorage: (() => Promise<void> | void) | undefined

  let cache: ScannedNitroTasks | null = null

  const refreshDebounced = debounce(() => {
    cache = null
    refresh('getServerTasks')
  }, 500)

  nuxt.hook('nitro:init', (_) => {
    nitro = _
    cache = null
    refresh('getServerTasks')
  })

  nuxt.hook('ready', async () => {
    if (!nitro)
      return

    await unwatchStorage?.()
    unwatchStorage = await watchStorageMount(nitro.storage, 'src', (_event, key) => {
      if (key.startsWith('src:tasks:'))
        refreshDebounced()
    })
  })

  nuxt.hook('close', async () => {
    await unwatchStorage?.()
    unwatchStorage = undefined
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
        tasks: nitro.options.tasks,
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
