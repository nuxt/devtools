import type { ClientFunctions } from '../../src/types'

export function setupClientRPC() {
  const nuxt = useNuxtApp()
  const router = useRouter()

  Object.assign(clientFunctions, {
    async refresh(type) {
      // refresh useAsyncData
      nuxt.hooks.callHookParallel('app:data:refresh', [type])
    },
    async callHook(hook: string, ...args: any[]) {
      nuxt.hooks.callHookParallel(hook as any, ...args)
    },
    async onTerminalData(id: string, data: string) {
      // @ts-expect-error fail to extend hooks
      nuxt.hooks.callHookParallel('devtools:terminal:data', { id, data })
    },
    async onTerminalExit(id: string, code: number) {
      // @ts-expect-error fail to extend hooks
      nuxt.hooks.callHookParallel('devtools:terminal:exit', { id, code })
    },
    async navigateTo(path: string) {
      router.push(path)
    },
  } satisfies ClientFunctions)
}
