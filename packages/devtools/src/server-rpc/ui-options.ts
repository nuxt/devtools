import { homedir } from 'node:os'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { hash } from 'ohash'
import { join } from 'pathe'
import type { NuxtDevToolsUIOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'

const defaults: NuxtDevToolsUIOptions = {
  componentsView: 'list',
  componentsGraphShowNodeModules: false,
  componentsGraphShowPages: false,
  componentsGraphShowLayouts: false,
  componentsGraphShowWorkspace: true,
  interactionCloseOnOutsideClick: false,
  showExperimentalFeatures: false,
  showHelpButtons: true,
  scale: 1,
  hiddenTabs: [],
  hiddenTabCategories: [],
}

export function setupUIOptionsRPC({ nuxt }: NuxtDevtoolsServerContext) {
  const home = homedir()
  const projectHash = hash(nuxt.options.rootDir)
  const dir = join(home, '.nuxt/devtools')
  const filepath = join(dir, `${projectHash}.json`)

  let settings: NuxtDevToolsUIOptions | undefined

  async function getUIOptions() {
    if (!settings)
      await read()
    return settings!
  }

  async function read() {
    if (existsSync(filepath)) {
      settings = {
        ...defaults,
        ...JSON.parse(await fs.readFile(filepath, 'utf-8')).settings || {},
      }
    }
    else {
      settings = { ...defaults }
    }
    return settings!
  }

  async function write(settings: NuxtDevToolsUIOptions) {
    if (!existsSync(dir))
      await fs.mkdir(dir, { recursive: true })

    await fs.writeFile(
      filepath,
      JSON.stringify({
        root: nuxt.options.rootDir,
        hash: projectHash,
        settings,
      }, null, 2),
      'utf-8',
    )
  }

  return {
    async updateUIOptions(_settings) {
      const settings = await getUIOptions()
      Object.assign(settings, _settings)
      await write(settings)
    },
    getUIOptions,
  } satisfies Partial<ServerFunctions>
}
