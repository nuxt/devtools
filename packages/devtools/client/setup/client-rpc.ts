import type { ClientFunctions } from '../../src/types'
import { useNuxtApp, useRouter } from '#imports'
import { useClient } from '../composables/client'
import { clientFunctions, registerClientFunctions } from '../composables/rpc'
import { useDevToolsOptions } from '../composables/storage-options'
import { telemetry } from '../composables/telemetry'

export function setupClientRPC() {
  const nuxt = useNuxtApp()
  const client = useClient()
  const router = useRouter()

  Object.assign(clientFunctions, {
    async refresh(type) {
      // refresh useAsyncData
      nuxt.hooks.callHookParallel('app:data:refresh', [type])
    },
    async callHook(hook: string, ...args: any[]) {
      nuxt.hooks.callHookParallel(hook as any, ...args)
    },
    async onTerminalExit(data) {
      // Minimal completion signal for generic package updates: re-dispatch it as
      // the `devtools:terminal:exit` hook that `usePackageUpdate` and the restart
      // prompt listen to. Module install/uninstall and analyze-build clear their
      // own UI from the awaited RPC / refreshed info, so nothing else runs here.
      // @ts-expect-error fail to extend hooks
      nuxt.hooks.callHookParallel('devtools:terminal:exit', data)
    },
    async navigateTo(path: string) {
      client.value.devtools.open()
      if (router.currentRoute.value?.path !== path)
        router.push(path)
    },
  } satisfies ClientFunctions)

  // Re-register client functions now that they're populated
  registerClientFunctions()

  const {
    hiddenTabs,
    pinnedTabs,
  } = useDevToolsOptions('ui')

  telemetry('open', {
    hiddenTabs: hiddenTabs.value.join(','),
    pinnedTabs: pinnedTabs.value.join(','),
  }, true)
}
