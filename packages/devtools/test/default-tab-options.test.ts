import { describe, expect, it } from 'vitest'
import { createDefaultTabOptions, setServerTasksEnabledByDefault } from '../src/constant'
import { setupOptionsRPC } from '../src/server-rpc/options'

describe('createDefaultTabOptions', () => {
  it('returns a brand-new object graph on every call', () => {
    const a = createDefaultTabOptions()
    const b = createDefaultTabOptions()
    expect(a).not.toBe(b)
    expect(a.ui).not.toBe(b.ui)
    expect(a.ui.hiddenTabs).not.toBe(b.ui.hiddenTabs)
  })

  it('does not leak mutations across calls when the options RPC mutates its cache', async () => {
    // Guards against the regression where the options RPC aliased (and later
    // shallow-copied from) a shared defaults object, letting callers corrupt
    // it via nested objects/arrays such as `ui.hiddenTabs`.
    const ctx = {
      nuxt: { options: { rootDir: '/mock/root' }, callHook: () => {} },
    } as any

    const rpc = setupOptionsRPC(ctx)
    const uiOptions = await rpc.getOptions('ui')

    // Mutate a nested array to verify isolation.
    uiOptions.hiddenTabs.push('test-leak')
    expect(createDefaultTabOptions().ui.hiddenTabs).not.toContain('test-leak')
  })

  it('reflects setServerTasksEnabledByDefault in subsequently created objects', () => {
    expect(createDefaultTabOptions().serverTasks.enabled).toBe(false)

    setServerTasksEnabledByDefault(true)
    try {
      expect(createDefaultTabOptions().serverTasks.enabled).toBe(true)
    }
    finally {
      // Reset the module-level flag so it doesn't leak into other tests.
      setServerTasksEnabledByDefault(false)
    }
  })
})
