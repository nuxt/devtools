import { promisify } from 'node:util'
import { join } from 'pathe'
import type { Nuxt } from 'nuxt/schema'
import { addVitePlugin } from '@nuxt/kit'
import Inspect from 'vite-plugin-inspect'
import folderSizeCallback from 'fast-folder-size'
import type { AnalyzeBuildMeta, ModuleOptions } from '../types'

const folderSize = promisify(folderSizeCallback)

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
    const _meta = meta as AnalyzeBuildMeta
    _meta.size = _meta.size || {}
    _meta.size.clientBundle = await folderSize(join(meta.buildDir, 'dist/client'))
    _meta.size.nitroBundle = await folderSize(meta.outDir)
  })
}
