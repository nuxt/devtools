import fsp from 'node:fs/promises'
import fs from 'node:fs'
import { startSubprocess } from '@nuxt/devtools-kit'
import { dirname, join } from 'pathe'
import fg from 'fast-glob'
import type { NuxtAnalyzeMeta } from '@nuxt/schema'
import type { AnalyzeBuildMeta, NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupAnalyzeBuildRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let builds: AnalyzeBuildMeta[] = []
  let promise: Promise<any> | undefined
  let initalized: Promise<any> | undefined

  const processId = 'devtools:analyze-build'

  const analyzeDir = join(nuxt.options.rootDir, '.nuxt-analyze')

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
    const files = await fg('*/meta.json', { cwd: analyzeDir, onlyFiles: true, absolute: true })
    builds = await Promise.all(files.map(async (file) => {
      const dir = dirname(file)
      const json = JSON.parse(await fsp.readFile(file, 'utf-8')) as NuxtAnalyzeMeta
      return <AnalyzeBuildMeta>{
        ...json,
        features: {
          bundleClient: fs.existsSync(join(dir, 'client.html')),
          bundleNitro: fs.existsSync(join(dir, 'nitro.html')),
          viteInspect: fs.existsSync(join(dir, '.vite-inspect')),
        },
      }
    }))
    return builds
  }

  return {
    async getAnalyzeBuildInfo() {
      if (!initalized)
        initalized = readBuildInfo()
      await initalized
      return {
        isBuilding: !!promise,
        builds,
      }
    },
    startAnalyzeBuild,
  } satisfies Partial<ServerFunctions>
}
