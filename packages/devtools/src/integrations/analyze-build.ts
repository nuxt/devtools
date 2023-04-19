import { join } from 'pathe'
import type { Nuxt } from 'nuxt/schema'
import { addVitePlugin } from '@nuxt/kit'
import Inspect from 'vite-plugin-inspect'
import type { ModuleOptions } from '../types'

export async function setup(nuxt: Nuxt, options: ModuleOptions) {
  if (options.viteInspect !== false) {
    addVitePlugin(
      Inspect({
        build: true,
        outputDir: join(nuxt.options.analyzeDir, '.vite-inspect'),
      }),
    )
  }

  nuxt.hook('build:analyze:done', async (meta) => {
    // await fsp.writeFile(join(statsDir, 'index.json'), JSON.stringify(<AnalyticBuild>{
    //   buildTime: Date.now(),
    //   dir: statsDir,
    // }, null, 2))
    // console.log('build:analyze:done', meta)
  })
}
