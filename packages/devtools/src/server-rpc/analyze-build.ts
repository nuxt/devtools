import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { startSubprocess } from '@nuxt/devtools-kit'
import { join } from 'pathe'
import type { NuxtAnalyzeMeta } from '@nuxt/schema'
import type { NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupAnalyzeBuildRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let lastBuild: NuxtAnalyzeMeta | undefined
  let promise: Promise<any> | undefined
  let initalized = false

  const processId = 'devtools:analyze-build'

  // TODO:
  const statsDir = join(nuxt.options.rootDir, '.nuxt/analyze/default')

  async function startAnalyzeBuild() {
    if (promise)
      throw new Error('Already building')

    const result = startSubprocess({
      command: 'npx',
      args: ['nuxi', 'analyze', '--no-serve'],
      cwd: nuxt.options.rootDir,
    }, {
      id: processId,
      name: 'Analyze Build',
      icon: 'logos-nuxt-icon',
    }, nuxt)

    refresh('getAnalyzeBuildInfo')

    promise = result.getProcess()
      .then(() => readBuildInfo())
      .finally(() => {
        promise = undefined
        refresh('getAnalyzeBuildInfo')
      })

    return processId
  }

  async function readBuildInfo() {
    const index = join(statsDir, 'meta.json')
    if (!fs.existsSync(index))
      return

    lastBuild = JSON.parse(await fsp.readFile(index, 'utf-8'))
    return lastBuild
  }

  return {
    async getAnalyzeBuildInfo() {
      if (!initalized) {
        initalized = true
        await readBuildInfo()
      }
      return {
        isBuilding: !!promise,
        lastBuild,
      }
    },
    startAnalyzeBuild,
  } satisfies Partial<ServerFunctions>
}
