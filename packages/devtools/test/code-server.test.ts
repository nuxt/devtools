import type { Nuxt } from 'nuxt/schema'
import { createHooks } from 'hookable'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultOptions } from '../src/constant'
import { resolveCodeServerOptions, setup } from '../src/integrations/code-server'

const mocks = vi.hoisted(() => ({
  createCodeServerDevframe: vi.fn(),
  mountDevframe: vi.fn(),
  setupCodeServer: vi.fn(),
  dispose: vi.fn(),
}))

vi.mock('@devframes/plugin-code-server', () => ({
  createCodeServerDevframe: mocks.createCodeServerDevframe,
}))

vi.mock('@devframes/plugin-code-server/node', () => ({
  setupCodeServer: mocks.setupCodeServer,
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
  // Give diagnostics a per-context deduplication state.
  ;(nuxt as any).devtools = ctx
  return { ctx, nuxt }
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.createCodeServerDevframe.mockImplementation(() => ({
    id: 'devframes_plugin_code-server',
    name: 'Code Server',
    version: '0.7.9',
    packageName: '@devframes/plugin-code-server',
    homepage: 'https://github.com/devframes/devframe',
    description: 'Code Server',
    setup: vi.fn(),
  }))
  mocks.setupCodeServer.mockResolvedValue({ dispose: mocks.dispose })
  mocks.mountDevframe.mockImplementation(async (_kit, definition) => {
    await definition.setup({ cwd: '/project' })
  })
})

describe('code server options', () => {
  it('is enabled by default without creating implicit legacy configuration', () => {
    expect(defaultOptions.codeServer).toEqual({ enabled: true })
    expect(defaultOptions.vscode).toBeUndefined()
  })

  it('projects every curated option and defaults cwd to the Nuxt root', () => {
    const args = ['--disable-file-downloads']
    const env = { LOG_LEVEL: 'debug' }
    expect(resolveCodeServerOptions({
      bin: '/usr/local/bin/code-server',
      serverPort: 9090,
      host: '0.0.0.0',
      args,
      env,
      cookieSuffix: 'nuxt',
      startTimeout: 45_000,
    }, '/project')).toEqual({
      backend: 'code-server',
      bin: '/usr/local/bin/code-server',
      cwd: '/project',
      serverPort: 9090,
      host: '0.0.0.0',
      args,
      env,
      cookieSuffix: 'nuxt',
      startTimeout: 45_000,
    })

    expect(resolveCodeServerOptions({ cwd: '/workspace' }, '/project').cwd).toBe('/workspace')
  })

  it.each([
    '--auth',
    '--auth=none',
    '--bind-addr',
    '--bind-addr=0.0.0.0:9999',
    '--cookie-suffix',
    '--cookie-suffix=other',
  ])('rejects reserved argument %s', (arg) => {
    expect(() => resolveCodeServerOptions({ args: [arg] }, '/project'))
      .toThrow(`codeServer.args cannot override ${arg.split('=')[0]}`)
  })

  it.each(['PASSWORD', 'HASHED_PASSWORD'])('rejects reserved environment key %s', (key) => {
    expect(() => resolveCodeServerOptions({ env: { [key]: 'secret' } }, '/project'))
      .toThrow(`codeServer.env cannot set ${key}`)
  })
})

describe('code server setup', () => {
  it('does not create or mount a definition when disabled', async () => {
    const { ctx, nuxt } = fakeContext({ codeServer: { enabled: false } })
    setup(ctx)
    await nuxt.callHook('devtools:ready', {} as any)

    expect(mocks.createCodeServerDevframe).not.toHaveBeenCalled()
    expect(mocks.mountDevframe).not.toHaveBeenCalled()
  })

  it('mounts the plugin in the Nuxt group and disposes its supervisor on close', async () => {
    const { ctx, nuxt } = fakeContext({ codeServer: { serverPort: 9090 } })
    setup(ctx)

    expect(mocks.createCodeServerDevframe).toHaveBeenCalledWith(expect.objectContaining({
      backend: 'code-server',
      cwd: '/project',
      serverPort: 9090,
    }))

    const kit = { id: 'kit' }
    await nuxt.callHook('devtools:ready', kit as any)
    expect(mocks.mountDevframe).toHaveBeenCalledWith(
      kit,
      expect.objectContaining({ id: 'devframes_plugin_code-server' }),
      {
        dock: {
          groupId: 'nuxt',
          category: 'modules',
        },
      },
    )
    expect(mocks.setupCodeServer).toHaveBeenCalledWith(
      { cwd: '/project' },
      expect.objectContaining({ backend: 'code-server', serverPort: 9090 }),
    )

    await nuxt.callHook('close', nuxt)
    expect(mocks.dispose).toHaveBeenCalledOnce()
  })

  it('waits for in-flight setup before disposing on close', async () => {
    let resolveSetup!: (supervisor: { dispose: () => void }) => void
    mocks.setupCodeServer.mockReturnValueOnce(new Promise((resolve) => {
      resolveSetup = resolve
    }))

    const { ctx, nuxt } = fakeContext()
    setup(ctx)

    const ready = nuxt.callHook('devtools:ready', { id: 'kit' } as any)
    await vi.waitFor(() => {
      expect(mocks.setupCodeServer).toHaveBeenCalledOnce()
    })

    const close = nuxt.callHook('close', nuxt)
    resolveSetup({ dispose: mocks.dispose })

    await Promise.all([ready, close])
    expect(mocks.dispose).toHaveBeenCalledOnce()
  })

  it('emits the legacy option diagnostic once and ignores its value', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { ctx } = fakeContext({
      codeServer: { enabled: false },
      vscode: { enabled: true, mode: 'tunnel', startOnBoot: true },
    })

    setup(ctx)
    setup(ctx)

    const outputs = warn.mock.calls.map(call => String(call[0])).filter(output => output.includes('NDT_DEP_0008'))
    warn.mockRestore()
    expect(outputs).toHaveLength(1)
    expect(outputs[0]).toContain('`devtools.vscode` is deprecated')
    expect(outputs[0]).toContain('migration-v4#ndt_dep_0008')
    expect(mocks.createCodeServerDevframe).not.toHaveBeenCalled()
  })
})
