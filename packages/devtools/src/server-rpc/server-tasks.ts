import type { NitroLike, NuxtDevtoolsServerContext, ScannedNitroTasks, ServerFunctions } from '../types'
import { relative, resolve } from 'pathe'
import { debounce } from 'perfect-debounce'

export function setupServerTasksRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let nitro: NitroLike | undefined

  let cache: ScannedNitroTasks | null = null

  const refreshDebounced = debounce(() => {
    cache = null
    refresh('getServerTasks')
  }, 500)

  nuxt.hook('nitro:init', (_: NitroLike) => {
    nitro = _
    cache = null
    refresh('getServerTasks')
  })

  // Watch for server task file changes
  const serverDir = resolve(nuxt.options.srcDir, nuxt.options.serverDir)
  nuxt.hook('builder:watch', (_event, path) => {
    const absolutePath = resolve(nuxt.options.srcDir, path)
    const rel = relative(serverDir, absolutePath)
    if (rel.startsWith('tasks/')) {
      refreshDebounced()
    }
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
