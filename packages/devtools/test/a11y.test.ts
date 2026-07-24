import type { Nuxt } from 'nuxt/schema'
import { createHooks } from 'hookable'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultOptions } from '../src/constant'
import { setup } from '../src/integrations/a11y'

const mocks = vi.hoisted(() => ({
  createA11yDevframe: vi.fn(),
  mountDevframe: vi.fn(),
  a11yAgentBundlePath: '/abs/path/to/@devframes/plugin-a11y/dist/inject/inject.js',
}))

vi.mock('@devframes/plugin-a11y', () => ({
  createA11yDevframe: mocks.createA11yDevframe,
  a11yAgentBundlePath: mocks.a11yAgentBundlePath,
}))

vi.mock('@vitejs/devtools-kit/node', () => ({
  mountDevframe: mocks.mountDevframe,
}))

function fakeContext(moduleOptions: Record<string, any> = {}) {
  const hooks = createHooks()
  const nuxt = {
    options: { rootDir: '/project' },
    hooks,
    hook: hooks.hook.bind(hooks),
    callHook: hooks.callHook.bind(hooks),
  } as unknown as Nuxt
  const ctx = {
    nuxt,
    options: moduleOptions,
  } as any
  return { ctx, nuxt }
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.createA11yDevframe.mockImplementation(() => ({
    id: 'devframes_plugin_a11y',
    name: 'A11y Inspector',
    version: '0.7.11',
    packageName: '@devframes/plugin-a11y',
    setup: vi.fn(),
  }))
})

describe('a11y default option', () => {
  it('is enabled by default', () => {
    expect(defaultOptions.a11y).toEqual({ enabled: true })
  })
})

describe('a11y setup', () => {
  it('does not create or mount a definition when disabled', async () => {
    const { ctx, nuxt } = fakeContext({ a11y: { enabled: false } })
    setup(ctx)
    await nuxt.callHook('devtools:ready', {} as any)

    expect(mocks.createA11yDevframe).not.toHaveBeenCalled()
    expect(mocks.mountDevframe).not.toHaveBeenCalled()
  })

  it('mounts the plugin in the Nuxt group and injects the agent client script', async () => {
    const { ctx, nuxt } = fakeContext()
    setup(ctx)

    expect(mocks.createA11yDevframe).toHaveBeenCalledOnce()

    const kit = { id: 'kit' }
    await nuxt.callHook('devtools:ready', kit as any)

    expect(mocks.mountDevframe).toHaveBeenCalledWith(
      kit,
      expect.objectContaining({ id: 'devframes_plugin_a11y' }),
      {
        dock: {
          groupId: 'nuxt',
          category: 'framework',
          defaultOrder: -150,
          clientScript: {
            importFrom: `/@fs/${mocks.a11yAgentBundlePath}`,
          },
        },
      },
    )
  })

  it('mounts by default when no a11y option is provided', async () => {
    const { ctx, nuxt } = fakeContext({})
    setup(ctx)
    await nuxt.callHook('devtools:ready', { id: 'kit' } as any)

    expect(mocks.mountDevframe).toHaveBeenCalledOnce()
  })
})
