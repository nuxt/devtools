import type { NuxtDevToolsOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { createDefaultTabOptions } from '../constant'
import { clearLocalOptions, readLocalOptions, writeLocalOptions } from '../utils/local-options'

let options: NuxtDevToolsOptions | undefined

export function getOptions() {
  return options
}

export function setupOptionsRPC({ nuxt }: NuxtDevtoolsServerContext) {
  const hasReadOnce = new Set<keyof NuxtDevToolsOptions>()

  async function getOptions<T extends keyof NuxtDevToolsOptions>(tab: T): Promise<NuxtDevToolsOptions[T]> {
    // `createDefaultTabOptions()` always returns a brand-new object graph, so
    // this can never alias (or leak mutations back into) another instance's
    // defaults the way sharing a single module-level constant used to.
    if (!options)
      options = createDefaultTabOptions()
    if (!hasReadOnce.has(tab))
      await read(tab)

    return options[tab]
  }

  async function read<T extends keyof NuxtDevToolsOptions>(tab: T) {
    // Source defaults fresh from `createDefaultTabOptions()` rather than the
    // cached `options![tab]`, so a dynamic default set after the cache was
    // first created — e.g. `serverTasks.enabled` toggled by Nitro's `tasks`
    // feature — is still honored the first time this tab is actually read.
    options![tab] = await readLocalOptions<NuxtDevToolsOptions[T]>(createDefaultTabOptions()[tab], {
      root: nuxt.options.rootDir,
      key: tab !== 'ui' && tab,
    })
    hasReadOnce.add(tab)
    return options
  }

  getOptions('ui')

  async function clearOptions() {
    options = undefined
    await clearLocalOptions({
      root: nuxt.options.rootDir,
    })
  }

  return {
    async updateOptions(tab, _settings) {
      const settings = await getOptions(tab)
      Object.assign(settings, _settings)
      await writeLocalOptions(
        { ...settings },
        {
          root: nuxt.options.rootDir,
          key: tab !== 'ui' && tab,
        },
      )
      nuxt.callHook('builder:generateApp', {
        filter(template) {
          return template.filename.includes('devtools/settings.js')
        },
      })
    },
    getOptions,
    clearOptions,
  } satisfies Partial<ServerFunctions>
}
