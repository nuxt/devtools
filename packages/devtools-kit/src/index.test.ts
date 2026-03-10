import { Buffer } from 'node:buffer'
import { EventEmitter } from 'node:events'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { extendServerRpc, startSubprocess } from './index'

const { execaMock } = vi.hoisted(() => ({
  execaMock: vi.fn(),
}))

vi.mock('execa', () => ({
  execa: execaMock,
}))

class MockProcess extends EventEmitter {
  stdout = new EventEmitter()
  stderr = new EventEmitter()
  kill = vi.fn()
}

describe('@nuxt/devtools-kit compat helpers', () => {
  beforeEach(() => {
    execaMock.mockReset()
  })

  it('extends server rpc through devtools context', () => {
    const rpc = {
      broadcast: {
        ping: vi.fn(),
      },
    }
    const nuxt = {
      devtools: {
        extendServerRpc: vi.fn(() => rpc),
      },
    }

    const result = extendServerRpc('custom-rpc', {
      hello() {
        return 'hi'
      },
    }, nuxt as any)

    expect((nuxt.devtools.extendServerRpc as any).mock.calls[0]?.[0]).toBe('custom-rpc')
    expect(result).toBe(rpc as any)
  })

  it('streams subprocess output to terminal hooks', () => {
    const process = new MockProcess()
    execaMock.mockReturnValue(process)

    const callHook = vi.fn()
    const closeHooks: (() => void)[] = []
    const nuxt = {
      callHook,
      hook(name: string, fn: () => void) {
        if (name === 'close')
          closeHooks.push(fn)
      },
    }

    const subprocess = startSubprocess(
      {
        command: 'node',
        args: ['-e', 'console.log("hello")'],
      },
      {
        id: 'devtools:test',
        name: 'Test Terminal',
      },
      nuxt as any,
    )

    expect(callHook).toHaveBeenCalledWith('devtools:terminal:register', expect.objectContaining({
      id: 'devtools:test',
      name: 'Test Terminal',
    }))
    expect(callHook).toHaveBeenCalledWith('devtools:terminal:write', expect.objectContaining({
      id: 'devtools:test',
      data: expect.stringContaining('node -e console.log("hello")'),
    }))

    process.stdout.emit('data', Buffer.from('stdout'))
    process.stderr.emit('data', Buffer.from('stderr'))
    process.emit('exit', 0)

    expect(callHook).toHaveBeenCalledWith('devtools:terminal:write', { id: 'devtools:test', data: 'stdout' })
    expect(callHook).toHaveBeenCalledWith('devtools:terminal:write', { id: 'devtools:test', data: 'stderr' })
    expect(callHook).toHaveBeenCalledWith('devtools:terminal:exit', { id: 'devtools:test', code: 0 })

    subprocess.terminate()
    expect(callHook).toHaveBeenCalledWith('devtools:terminal:remove', { id: 'devtools:test' })

    closeHooks.forEach(fn => fn())
    expect((process as any).kill).toHaveBeenCalled()
  })
})
