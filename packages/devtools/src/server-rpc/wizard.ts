import { logger } from '@nuxt/kit'
import { colors } from 'consola/utils'
import type { NuxtDevtoolsServerContext, ServerFunctions, WizardActions } from '@nuxt/devtools-kit/types'
import { LOG_PREFIX } from '../logger'
import { wizard } from '../wizard'

export function setupWizardRPC({ nuxt, ensureDevAuthToken }: NuxtDevtoolsServerContext) {
  return {
    async runWizard(token, name: WizardActions, ...args: any[]) {
      await ensureDevAuthToken(token)
      logger.info(LOG_PREFIX, `Running wizard ${colors.green(name)}...`)
      return (wizard[name] as any)(nuxt, ...args as [])
    },
  } satisfies Partial<ServerFunctions>
}
