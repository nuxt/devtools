import type { NuxtDevToolsOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { defaultTabOptions } from '../constant'
import { clearLocalOptions, readLocalOptions, writeLocalOptions } from '../utils/local-options'

let options: NuxtDevToolsOptions | undefined

export function getOptions() {
  return options
}

export function setupOptionsRPC({ nuxt }: NuxtDevtoolsServerContext) {
  const hasReadOnce = new Set<keyof NuxtDevToolsOptions>()

  async function getOptions<T extends keyof NuxtDevToolsOptions>(tab: T): Promise<NuxtDevToolsOptions[T]> {
    if (!options)
      options = structuredClone(defaultTabOptions)
    if (options[tab] === undefined || !hasReadOnce.has(tab))
      await read(tab)

    return options[tab]
  }

  async function read<T extends keyof NuxtDevToolsOptions>(tab: T) {
    // Pass the already-cloned `options![tab]` (not `defaultTabOptions[tab]`) as the
    // defaults argument: `readLocalOptions` only shallow-copies its defaults, so
    // sourcing from the shared constant here would leak its nested objects/arrays
    // back into the cache and let later mutations corrupt `defaultTabOptions`.
    options![tab] = await readLocalOptions<NuxtDevToolsOptions[T]>(options![tab], {
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
