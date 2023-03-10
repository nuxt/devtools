import c from 'picocolors'
import { logger } from '@nuxt/kit'
import type { ServerFunctions } from '../types'
import type { WizardActions } from '../wizard'
import { wizard } from '../wizard'
import { LOG_PREFIX } from '../logger'
import type { RPCContext } from './types'

export function setupWizardRPC({ nuxt }: RPCContext) {
  return {
    runWizard(name: WizardActions, ...args: any[]) {
      logger.info(LOG_PREFIX, `Running wizard ${c.green(name)}...`)
      return wizard[name](nuxt, ...args as [])
    },
  } satisfies Partial<ServerFunctions>
}
