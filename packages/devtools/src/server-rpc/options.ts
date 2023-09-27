import type { NuxtDevToolsOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { readLocalOptions, writeLocalOptions } from '../utils/local-options'
import { defaultTabOptions } from '../constant'

export function setupOptionsRPC({ nuxt }: NuxtDevtoolsServerContext) {
  let options: NuxtDevToolsOptions | undefined

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
          return template.filename.includes('devtools/settings.mjs')
        },
      })
    },
    getOptions,
  } satisfies Partial<ServerFunctions>
}
