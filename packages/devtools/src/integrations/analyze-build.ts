import fsp from 'node:fs/promises'
import type { Nuxt } from 'nuxt/schema'
import { join } from 'pathe'
import type { AnalyticBuild } from '../types'

export async function setup(nuxt: Nuxt) {
  if (nuxt.options.dev || !nuxt.options.build.analyze)
    return

  // TODO: dynamic
  const statsDir = join(nuxt.options.rootDir, '.nuxt/stats')

  nuxt.hook('build:done', async () => {
    await fsp.writeFile(join(statsDir, 'index.json'), JSON.stringify(<AnalyticBuild>{
      buildTime: Date.now(),
      dir: statsDir,
    }, null, 2))
  })
}
