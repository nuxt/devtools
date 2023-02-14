import type { Hookable } from 'hookable'
import type { HookInfo } from '../../types'

export function setupHooksDebug<T extends Hookable<any>>(hooks: T) {
  const serverHooks: Record<string, HookInfo> = {}

  // eslint-disable-next-line no-constant-condition
  const now = typeof 'performance' === 'undefined'
    ? () => window.performance.now()
    : () => Date.now()

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
