import fs from 'node:fs/promises'
import c from 'picocolors'
import { logger } from '@nuxt/kit'
import type { NuxtDevtoolsServerContext, ServerFunctions, WizardActions } from '@nuxt/devtools-kit/types'
import { parseModule } from 'magicast'
import { addNuxtModule } from 'magicast/helpers'
import { wizard } from '../wizard'
import { LOG_PREFIX } from '../logger'

export function setupWizardRPC({ nuxt }: NuxtDevtoolsServerContext) {
  return {
    runWizard(name: WizardActions, ...args: any[]) {
      logger.info(LOG_PREFIX, `Running wizard ${c.green(name)}...`)
      return (wizard[name] as any)(nuxt, ...args as [])
    },
    async installNuxtModule(name: string, dry = true) {
      const filepath = nuxt.options._nuxtConfigFile
      const source = await fs.readFile(filepath, 'utf-8')
      const mod = await parseModule(source, { sourceFileName: filepath })

      addNuxtModule(mod, name)

      const generated = mod.generate().code

      // TODO: do the action
      // if (!dry) {

      // }

      return {
        original: source,
        generated,
      }
    },
  } satisfies Partial<ServerFunctions>
}
