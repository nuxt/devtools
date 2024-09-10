import type { HookInfo } from '@nuxt/devtools/types'
import type { Hookable } from 'hookable'

export function setupHooksDebug<T extends Hookable<any>>(hooks: T) {
  const serverHooks: Record<string, HookInfo> = {}

  // maybe run in node or browser env
  // performance api is not supported below node version v16.0.0
  // browser support https://caniuse.com/mdn-api_performance
  // if `performance` is undefined then downgrade to `Date`

  const now = typeof globalThis.performance === 'undefined'
    ? () => Date.now()
    : () => performance.now()

  hooks.beforeEach((event) => {
    if (!serverHooks[event.name]) {
      serverHooks[event.name] = {
        name: event.name,
        start: now(),
        // @ts-expect-error private field
        listeners: hooks._hooks[event.name]?.length || 0,
        executions: [],
      }
    }
    else {
      const hook = serverHooks[event.name]
      if (hook.duration != null)
        hook.executions.push(hook.duration)
      hook.start = now()
      hook.end = undefined
      hook.duration = undefined
    }
  })

  hooks.afterEach((event) => {
    const hook = serverHooks[event.name]
    if (!hook)
      return
    hook.end = now()
    hook.duration = hook.end - hook.start
    // @ts-expect-error private field
    const listeners = hooks._hooks[event.name]?.length
    if (listeners != null)
      hook.listeners = listeners
  })
  return serverHooks
}
