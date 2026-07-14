import { describe, expect, it } from 'vitest'
import { defaultTabOptions } from '../src/constant'
import { setupOptionsRPC } from '../src/server-rpc/options'

describe('defaultTabOptions', () => {
  it('does not mutate shared defaults when the options RPC mutates its cache', async () => {
    // Guards against the regression where the options RPC aliased (and later
    // shallow-copied from) this constant, letting callers corrupt it via nested
    // objects/arrays such as `ui.hiddenTabs`.
    const ctx = {
      nuxt: { options: { rootDir: '/mock/root' }, callHook: () => {} },
    } as any

    const rpc = setupOptionsRPC(ctx)
    const uiOptions = await rpc.getOptions('ui')

    // Mutate a nested array to verify deep-clone isolation.
    uiOptions.hiddenTabs.push('test-leak')
    expect(defaultTabOptions.ui.hiddenTabs).not.toContain('test-leak')
  })
})
