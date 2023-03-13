import type { ClientFunctions } from '../../src/types'
import type {} from '../../src/types/hooks'

export function setupClientRPC() {
  const nuxt = useNuxtApp()

  Object.assign(clientFunctions, {
    async refresh(type) {
      // refresh useAsyncData
      nuxt.hooks.callHookParallel('app:data:refresh', [type])
    },
    async callHook(hook: string, ...args: any[]) {
      nuxt.hooks.callHookParallel(hook as any, ...args)
    },
    async onTerminalData(id: string, data: string) {
      nuxt.hooks.callHookParallel('devtools:terminal:data', { id, data })
    },
  } satisfies ClientFunctions)
}
