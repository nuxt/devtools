import { defaultTabOptions } from '../constant'
import { clearLocalOptions, readLocalOptions, writeLocalOptions } from '../utils/local-options'
import type { NuxtDevToolsOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'

let options: NuxtDevToolsOptions | undefined

export function getOptions() {
  return options
}

export function setupOptionsRPC({ nuxt }: NuxtDevtoolsServerContext) {
  async function getOptions<T extends keyof NuxtDevToolsOptions>(tab: T): Promise<NuxtDevToolsOptions[T]> {
    if (!options || options[tab]) {
      options = defaultTabOptions
      await read(tab)
    }

    return options![tab]
  }

  async function read<T extends keyof NuxtDevToolsOptions>(tab: T) {
    options![tab] = await readLocalOptions<NuxtDevToolsOptions[T]>(defaultTabOptions[tab], {
      root: nuxt.options.rootDir,
      key: tab !== 'ui' && tab,
    })
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
