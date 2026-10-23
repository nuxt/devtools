import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  readLocalOptions: vi.fn(),
  clearLocalOptions: vi.fn(),
  writeLocalOptions: vi.fn(),
}))

vi.mock('../src/utils/local-options', () => mocks)

function createContext(root = '/root') {
  return {
    nuxt: {
      options: { rootDir: root },
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
    const ctx = createContext()
    setupOptionsRPC(ctx)

    const first = ensureOptions('behavior', ctx.nuxt)
    const second = ensureOptions('behavior', ctx.nuxt)

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
    const ctx = createContext()
    const rpc = setupOptionsRPC(ctx)

    const initialRead = ensureOptions('behavior', ctx.nuxt)
    const update = rpc.updateOptions('behavior', { openInEditor: 'code' })

    await Promise.resolve()
    expect(countBehaviorReads()).toBe(1)

    resolveBehavior({ telemetry: null, openInEditor: 'sublime' })
    await Promise.all([initialRead, update])

    expect(countBehaviorReads()).toBe(1)
    expect(mocks.writeLocalOptions).toHaveBeenCalledTimes(1)
    expect(mocks.writeLocalOptions.mock.calls[0]![0].openInEditor).toBe('code')
  })

  it('resets cached options when the Nuxt root changes', async () => {
    mocks.readLocalOptions.mockImplementation((defaults: any, options: any) => {
      if (options.key === 'behavior') {
        return Promise.resolve({
          telemetry: null,
          openInEditor: options.root === '/root-a' ? 'sublime' : 'code',
        })
      }
      return Promise.resolve(defaults)
    })

    const { setupOptionsRPC, ensureOptions } = await import('../src/server-rpc/options')

    const a = createContext('/root-a')
    const b = createContext('/root-b')
    setupOptionsRPC(a)
    expect((await ensureOptions('behavior', a.nuxt)).openInEditor).toBe('subl')

    setupOptionsRPC(b)
    expect((await ensureOptions('behavior', b.nuxt)).openInEditor).toBe('code')
    expect((await ensureOptions('behavior', a.nuxt)).openInEditor).toBe('subl')
    expect(countBehaviorReads()).toBe(2)
  })

  it('keeps an older RPC bound to its own Nuxt root', async () => {
    mocks.readLocalOptions.mockImplementation((defaults: any, options: any) => {
      if (options.key === 'behavior') {
        return Promise.resolve({
          telemetry: null,
          openInEditor: options.root === '/root-a' ? 'sublime' : 'code',
        })
      }
      return Promise.resolve(defaults)
    })

    const { setupOptionsRPC } = await import('../src/server-rpc/options')
    const a = setupOptionsRPC(createContext('/root-a'))
    const b = setupOptionsRPC(createContext('/root-b'))

    expect((await b.getOptions('behavior')).openInEditor).toBe('code')
    await a.updateOptions('behavior', { openInEditor: 'sublime' })

    expect((await a.getOptions('behavior')).openInEditor).toBe('subl')
    expect((await b.getOptions('behavior')).openInEditor).toBe('code')
    expect(mocks.writeLocalOptions.mock.calls[0]![1].root).toBe('/root-a')
    expect(mocks.writeLocalOptions.mock.calls[0]![0].openInEditor).toBe('subl')
    expect(countBehaviorReads()).toBe(2)
  })

  it('re-reads options when an RPC is recreated for the same Nuxt root', async () => {
    let editor = 'sublime'
    mocks.readLocalOptions.mockImplementation((defaults: any, options: any) => {
      if (options.key === 'behavior')
        return Promise.resolve({ telemetry: null, openInEditor: editor })
      return Promise.resolve(defaults)
    })

    const { setupOptionsRPC, ensureOptions } = await import('../src/server-rpc/options')

    const a = createContext('/root-a')
    setupOptionsRPC(a)
    expect((await ensureOptions('behavior', a.nuxt)).openInEditor).toBe('subl')

    editor = 'code'
    const b = createContext('/root-a')
    setupOptionsRPC(b)
    expect((await ensureOptions('behavior', b.nuxt)).openInEditor).toBe('code')
    expect(countBehaviorReads()).toBe(2)

    editor = 'zed'
    setupOptionsRPC(b)
    expect((await ensureOptions('behavior', b.nuxt)).openInEditor).toBe('zed')
    expect(countBehaviorReads()).toBe(3)
  })

  it('discards reads that resolve after options are cleared', async () => {
    const reads: Array<(value: any) => void> = []

    mocks.readLocalOptions.mockImplementation((defaults: any, options: any) => {
      if (options.key === 'behavior') {
        return new Promise((resolve) => {
          reads.push(resolve)
        })
      }
      return Promise.resolve(defaults)
    })

    const { setupOptionsRPC, ensureOptions } = await import('../src/server-rpc/options')
    const ctx = createContext('/root')
    const rpc = setupOptionsRPC(ctx)

    const staleRead = ensureOptions('behavior', ctx.nuxt)
    await Promise.resolve()
    expect(reads).toHaveLength(1)

    await rpc.clearOptions()

    const freshRead = ensureOptions('behavior', ctx.nuxt)
    await Promise.resolve()
    expect(reads).toHaveLength(2)

    reads[1]!({ telemetry: null, openInEditor: 'code' })
    expect((await freshRead).openInEditor).toBe('code')

    reads[0]!({ telemetry: null, openInEditor: 'sublime' })
    await staleRead

    expect((await ensureOptions('behavior', ctx.nuxt)).openInEditor).toBe('code')
  })
})

function countBehaviorReads() {
  return mocks.readLocalOptions.mock.calls.filter(([, options]) => (options as any).key === 'behavior').length
}
