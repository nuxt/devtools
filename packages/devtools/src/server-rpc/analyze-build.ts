import fsp from 'node:fs/promises'
import fs from 'node:fs'
import { startSubprocess } from '@nuxt/devtools-kit'
import { dirname, join } from 'pathe'
import fg from 'fast-glob'
import Git from 'simple-git'
import type { NuxtAnalyzeMeta } from '@nuxt/schema'
import type { AnalyzeBuildMeta, NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupAnalyzeBuildRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let builds: AnalyzeBuildMeta[] = []
  let promise: Promise<any> | undefined
  let initalized: Promise<any> | undefined

  const processId = 'devtools:analyze-build'
  const analyzeDir = join(nuxt.options.rootDir, '.nuxt/analyze')

  async function startAnalyzeBuild(name: string) {
    if (promise)
      throw new Error('Already building')

    const result = startSubprocess({
      command: 'npx',
      args: ['nuxi', 'analyze', '--no-serve', '--name', name],
      cwd: nuxt.options.rootDir,
    }, {
      id: processId,
      name: 'Analyze Build',
      icon: 'logos-nuxt-icon',
    }, nuxt)

    refresh('getAnalyzeBuildInfo')

    promise = result.getProcess()
      .then(() => {
        refresh('getAnalyzeBuildInfo')
        return readBuildInfo()
      })
      .finally(() => {
        promise = undefined
        initalized = undefined
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
    return builds.sort((a, b) => b.endTime - a.endTime)
  }

  async function generateAnalyzeBuildName() {
    const git = Git(nuxt.options.rootDir)
    const branch = await git.branch()
    const branchName = branch.current || 'head'
    const sha = await git.revparse(['--short', 'HEAD'])
    const isWorkingTreeClean = (await git.status()).isClean()
    if (isWorkingTreeClean)
      return `${branchName}#${sha}`
    return `${branchName}#${sha}-dirty`
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
    async clearAnalyzeBuilds(names?: string[]) {
      if (!names) {
        await fsp.rm(analyzeDir, { recursive: true, force: true })
      }
      else {
        const targets = builds.filter(build => names.includes(build.name))
        await Promise.all(targets.map(target => fsp.rm(join(analyzeDir, target.slug), { recursive: true, force: true })))
      }
      initalized = readBuildInfo()
      refresh('getAnalyzeBuildInfo')
    },
    generateAnalyzeBuildName,
    startAnalyzeBuild,
  } satisfies Partial<ServerFunctions>
}
