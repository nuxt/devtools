import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  readLocalOptions: vi.fn(),
  clearLocalOptions: vi.fn(),
  writeLocalOptions: vi.fn(),
}))

vi.mock('../src/utils/local-options', () => mocks)

function createContext() {
  return {
    nuxt: {
      options: { rootDir: '/root' },
      callHook: vi.fn(),
    },
  } as any
}

describe('options concurrency', () => {
  beforeEach(() => {
    vi.resetModules()
    mocks.readLocalOptions.mockReset()
    mocks.clearLocalOptions.mockReset()
    mocks.writeLocalOptions.mockReset()
  })

  it('shares one in-flight read per tab', async () => {
    let resolveBehavior!: (value: any) => void
    const behaviorRead = new Promise((resolve) => {
      resolveBehavior = resolve
    })

    mocks.readLocalOptions.mockImplementation((defaults: any, options: any) => {
      if (options.key === 'behavior')
        return behaviorRead
      return Promise.resolve(defaults)
    })

    const { setupOptionsRPC, ensureOptions } = await import('../src/server-rpc/options')
    setupOptionsRPC(createContext())

    const first = ensureOptions('behavior')
    const second = ensureOptions('behavior')

    await Promise.resolve()
    expect(countBehaviorReads()).toBe(1)

    resolveBehavior({ telemetry: null, openInEditor: 'sublime' })
    const [firstResult, secondResult] = await Promise.all([first, second])

    expect(firstResult).toBe(secondResult)
    expect(firstResult.openInEditor).toBe('subl')
    expect(countBehaviorReads()).toBe(1)
  })

  it('does not start a new read while an update is waiting', async () => {
    let resolveBehavior!: (value: any) => void
    const behaviorRead = new Promise((resolve) => {
      resolveBehavior = resolve
    })

    mocks.readLocalOptions.mockImplementation((defaults: any, options: any) => {
      if (options.key === 'behavior')
        return behaviorRead
      return Promise.resolve(defaults)
    })

    const { setupOptionsRPC, ensureOptions } = await import('../src/server-rpc/options')
    const rpc = setupOptionsRPC(createContext())

    const initialRead = ensureOptions('behavior')
    const update = rpc.updateOptions('behavior', { openInEditor: 'code' })

    await Promise.resolve()
    expect(countBehaviorReads()).toBe(1)

    resolveBehavior({ telemetry: null, openInEditor: 'sublime' })
    await Promise.all([initialRead, update])

    expect(countBehaviorReads()).toBe(1)
    expect(mocks.writeLocalOptions).toHaveBeenCalledTimes(1)
    expect(mocks.writeLocalOptions.mock.calls[0]![0].openInEditor).toBe('code')
  })
})

function countBehaviorReads() {
  return mocks.readLocalOptions.mock.calls.filter(([, options]) => (options as any).key === 'behavior').length
}
