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
    async onTerminalData(data) {
      // @ts-expect-error fail to extend hooks
      nuxt.hooks.callHookParallel('devtools:terminal:data', data)
    },
    async onTerminalExit(data) {
      // @ts-expect-error fail to extend hooks
      nuxt.hooks.callHookParallel('devtools:terminal:exit', data)

      // remove installing modules entry
      const index = processInstallingModules.value.findIndex(i => i.processId === data.id)
      if (index !== -1)
        processInstallingModules.value.splice(index, 1)

      if (processAnalyzeBuildInfo.value?.processId === data.id)
        processAnalyzeBuildInfo.value = undefined
    },
    async navigateTo(path: string) {
      if (router.currentRoute.value.path !== path)
        router.push(path)
    },
  } satisfies ClientFunctions)
}
