import type { NuxtAnalyzeMeta } from '@nuxt/schema'
import type { AnalyzeBuildMeta, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { startSubprocess } from '@nuxt/devtools-kit'
import { dirname, join } from 'pathe'
import { x } from 'tinyexec'
import { glob } from 'tinyglobby'

const COLON_RE = /:/g

export function setupAnalyzeBuildRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let builds: AnalyzeBuildMeta[] = []
  let promise: Promise<any> | undefined
  let initalized: Promise<any> | undefined

  const processId = 'devtools:analyze-build'
  const devtoolsAnalyzeDir = join(nuxt.options.rootDir, 'node_modules/.cache/nuxt-devtools/analyze')

  async function startAnalyzeBuild(name: string) {
    if (promise)
      throw new Error('[Nuxt DevTools] A building process is already running')

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

    initalized = undefined
    promise = Promise.resolve(result.getResult())
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
    for (const dir of new Set([
      join(nuxt.options.rootDir, '.nuxt/analyze'),
      join(nuxt.options.rootDir, 'node_modules/.cache/nuxt/.nuxt/analyze'),
      nuxt.options.analyzeDir,
    ])) {
      const files = await glob(['**/meta.json', 'meta.json'], {
        cwd: dir,
        onlyFiles: true,
        absolute: true,
      })
      for (const file of files) {
        const slug = JSON.parse(await fsp.readFile(file, 'utf-8')).slug
        const dir = dirname(file)
        await fsp.mkdir(devtoolsAnalyzeDir, { recursive: true })
        await fsp.rename(dir, join(devtoolsAnalyzeDir, slug))
      }
    }

    const files = await glob(['**/meta.json'], {
      cwd: devtoolsAnalyzeDir,
      onlyFiles: true,
      absolute: true,
    })
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

  async function git(...args: string[]): Promise<string> {
    const result = await x('git', args, { nodeOptions: { cwd: nuxt.options.rootDir }, throwOnError: true })
    return result.stdout.trim()
  }

  async function generateAnalyzeBuildName() {
    try {
      const branchName = await git('rev-parse', '--abbrev-ref', 'HEAD') || 'head'
      const sha = await git('rev-parse', '--short', 'HEAD')
      const status = await git('status', '--porcelain')
      const isClean = status === ''
      if (isClean)
        return `${branchName}#${sha}`
      return `${branchName}#${sha}-dirty`
    }
    catch {
      // if the git is not available, fallback to iso string
      return new Date().toISOString().replace(COLON_RE, '-')
    }
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
        await fsp.rm(devtoolsAnalyzeDir, { recursive: true, force: true })
      }
      else {
        const targets = builds.filter(build => names.includes(build.name))
        await Promise.all(targets.map(target => fsp.rm(join(devtoolsAnalyzeDir, target.slug), { recursive: true, force: true })))
      }
      initalized = readBuildInfo()
      refresh('getAnalyzeBuildInfo')
    },
    generateAnalyzeBuildName,
    async startAnalyzeBuild(...args) {
      return startAnalyzeBuild(...args)
    },
  } satisfies Partial<ServerFunctions>
}
