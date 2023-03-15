import c from 'picocolors'
import { logger } from '@nuxt/kit'
import type { WizardActions } from '@nuxt/devtools-kit/types'
import type { ServerFunctions } from '../types'
import { wizard } from '../wizard'
import { LOG_PREFIX } from '../logger'
import type { NuxtDevtoolsServerContext } from './types'

export function setupWizardRPC({ nuxt }: NuxtDevtoolsServerContext) {
  return {
    runWizard(name: WizardActions, ...args: any[]) {
      logger.info(LOG_PREFIX, `Running wizard ${c.green(name)}...`)
      return (wizard[name] as any)(nuxt, ...args as [])
    },
  } satisfies Partial<ServerFunctions>
}
