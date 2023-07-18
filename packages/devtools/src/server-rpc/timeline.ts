import fs from 'node:fs/promises'
import { parseModule } from 'magicast'
import { getDefaultExportOptions } from 'magicast/helpers'
import type { NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupTimelineRPC({ nuxt }: NuxtDevtoolsServerContext) {
  return {
    async enableTimeline(dry: boolean) {
      const filepath = nuxt.options._nuxtConfigFile
      const source = await fs.readFile(filepath, 'utf-8')
      const mod = await parseModule(source, { sourceFileName: filepath })

      const options = getDefaultExportOptions(mod)

      options.devtools = options.devtools || {}
      options.devtools.timeline = options.devtools.timeline || {}
      options.devtools.timeline.enabled = true

      const generated = mod.generate().code

      if (!dry) {
        await fs.writeFile(filepath, generated, 'utf-8')
        await nuxt.callHook('restart', { hard: true })
      }

      return [source, generated]
    },
  } satisfies Partial<ServerFunctions>
}
