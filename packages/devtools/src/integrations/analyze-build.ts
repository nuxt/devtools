import type { Nuxt } from 'nuxt/schema'
import type { AnalyzeBuildMeta, ModuleOptions } from '../types'
import { addVitePlugin } from '@nuxt/kit'
import { join } from 'pathe'
import { getFolderSize } from '../utils/fs'
import { createVitePluginInspect } from './vite-inspect'

export async function setup(nuxt: Nuxt, options: ModuleOptions) {
  if (options.viteInspect !== false) {
    addVitePlugin(
      await createVitePluginInspect({
        build: true,
        outputDir: join(nuxt.options.analyzeDir, '.vite-inspect'),
      }),
    )
  }

  nuxt.hook('build:analyze:done', async (meta) => {
    const _meta = meta as AnalyzeBuildMeta
    _meta.size = _meta.size || {}

    const dirs = [join(meta.buildDir, 'dist/client'), meta.outDir]
    const [clientBundleSize, nitroBundleSize] = await Promise.all(dirs.map(getFolderSize))

    _meta.size.clientBundle = clientBundleSize
    _meta.size.nitroBundle = nitroBundleSize
  })
}
