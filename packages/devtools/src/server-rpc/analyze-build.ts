import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { startSubprocess } from '@nuxt/devtools-kit'
import { join } from 'pathe'
import type { AnalyticBuild, NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupAnalyzeBuildRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let lastBuild: AnalyticBuild | undefined
  let promise: Promise<any> | undefined
  let tryLoaded = false

  const id = 'devtools:analyze-build'

  // TODO: dynamic
  const statsDir = join(nuxt.options.rootDir, '.nuxt/stats')

  async function startAnalyzeBuild() {
    if (promise)
      throw new Error('Already building')

    const result = startSubprocess({
      command: 'npx',
      args: ['nuxi', 'analyze', '--no-serve'],
      cwd: nuxt.options.rootDir,
    }, {
      id,
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

    return id
  }

  async function readBuildInfo() {
    const index = join(statsDir, 'index.json')
    if (!fs.existsSync(index))
      return

    lastBuild = JSON.parse(await fsp.readFile(index, 'utf-8'))
    return lastBuild
  }

  return {
    async getAnalyzeBuildInfo() {
      if (!tryLoaded) {
        tryLoaded = true
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
