import type { ClientFunctions } from '../../src/types'

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
  } satisfies ClientFunctions)
}
