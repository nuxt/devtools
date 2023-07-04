import type { NuxtDevToolsOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { readOptions, writeOptions } from '../utils/options'
import { defaultTabOptions } from '../constant'

export function setupOptionsRPC({ nuxt }: NuxtDevtoolsServerContext) {
  let options: NuxtDevToolsOptions | undefined

  async function getOptions<T extends keyof NuxtDevToolsOptions>(tab: T): Promise<NuxtDevToolsOptions[T]> {
    if (!options) {
      options = defaultTabOptions
      await read(tab)
    }

    return options![tab]
  }

  async function read<T extends keyof NuxtDevToolsOptions>(tab: T) {
    options![tab] = await readOptions<NuxtDevToolsOptions[T]>(defaultTabOptions[tab], {
      root: nuxt.options.rootDir,
      key: tab !== 'ui' && tab,
    })
    return options
  }

  return {
    async updateOptions(tab, _settings) {
      const settings = await getOptions(tab)
      Object.assign(settings, _settings)
      await writeOptions({ ...settings }, {
        root: nuxt.options.rootDir,
        key: tab !== 'ui' && tab,
      })
    },
    getOptions,
  } satisfies Partial<ServerFunctions>
}
