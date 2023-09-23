import { colors } from 'consola/utils'
import { logger } from '@nuxt/kit'
import type { NuxtDevtoolsServerContext, ServerFunctions, WizardActions } from '@nuxt/devtools-kit/types'
import { wizard } from '../wizard'
import { LOG_PREFIX } from '../logger'

export function setupWizardRPC({ nuxt, ensureDevAuthToken }: NuxtDevtoolsServerContext) {
  return {
    async runWizard(token, name: WizardActions, ...args: any[]) {
      await ensureDevAuthToken(token)
      logger.info(LOG_PREFIX, `Running wizard ${colors.green(name)}...`)
      return (wizard[name] as any)(nuxt, ...args as [])
    },
  } satisfies Partial<ServerFunctions>
}
