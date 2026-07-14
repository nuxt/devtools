import type {
  DevToolsCommandsHost,
  DevToolsDiagnosticsHost,
  DevToolsDockHost,
  DevToolsMessagesHost,
  DevToolsTerminalHost,
  RpcFunctionsHost,
  ViteDevToolsNodeContext,
} from '@vitejs/devtools-kit'
import type { NuxtDevtoolsRpc } from '../types'
import { defineStandaloneDiagnostics } from '@nuxt/devtools-kit'

/**
 * A buffered call replayed against the real host once the Vite DevTools kit
 * connects. Thunks resolve their own deferred promises / bind their own lazy
 * handles when run.
 */
type PendingCall = () => void

/**
 * Shared queue of pre-connect host mutations. Flushed in order by
 * {@link flushPendingHostCalls} from `connectDevToolsKit`.
 */
export type PendingHostCalls = PendingCall[]

interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: unknown) => void
}

function createDeferred<T>(): Deferred<T> {
  let resolve!: Deferred<T>['resolve']
  let reject!: Deferred<T>['reject']
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

/**
 * A lazy stand-in for a handle that only exists after connect (e.g. the object
 * returned by `docks.register`, `commands.register`, `terminals.register`).
 *
 * Method calls made on it before the real handle exists are recorded and
 * replayed against the real handle once {@link bind} runs; afterwards calls
 * forward directly.
 */
function createLazyHandle(): { proxy: any, bind: (real: any) => void } {
  const recorded: { prop: string, args: any[] }[] = []
  let bound: any

  const proxy = new Proxy(function () {} as any, {
    get(_target, prop) {
      if (typeof prop !== 'string')
        return undefined
      if (bound !== undefined) {
        const value = bound[prop]
        return typeof value === 'function' ? value.bind(bound) : value
      }
      return (...args: any[]) => {
        recorded.push({ prop, args })
        return undefined
      }
    },
  })

  function bind(real: any): void {
    bound = real
    for (const { prop, args } of recorded) {
      const fn = real?.[prop]
      if (typeof fn === 'function')
        fn.apply(real, args)
    }
    recorded.length = 0
  }

  return { proxy, bind }
}

/**
 * A minimal no-op EventEmitter stand-in returned for a host's `events` before
 * connect, so `host.events.on(...)` never throws pre-connect.
 */
function createNoopEmitter(): any {
  const noop = (): any => undefined
  return new Proxy({}, { get: () => noop })
}

/**
 * Describes how each method / property of a host behaves when called before the
 * kit connects.
 */
interface HostBehaviour {
  /** Properties (not methods) that return an empty `Map` pre-connect. */
  maps: string[]
  /** Properties returning a no-op emitter pre-connect. */
  emitters: string[]
  /** Methods returning a promise that resolves after connect with the real value. */
  async: string[]
  /** Methods returning a lazy handle bound to the real handle after connect. */
  handles: string[]
  /** Read methods returning a synchronous default pre-connect (call is not buffered). */
  reads: Record<string, () => any>
  /** Mutating methods returning a synchronous default pre-connect (call IS buffered). */
  syncDefaults: Record<string, () => any>
}

/**
 * Build a connect-safe proxy for a devframe host.
 *
 * @param getHost   resolves the real host once connected, else `undefined`.
 * @param queue     shared buffer of pre-connect mutations to replay on connect.
 * @param behaviour per-method pre-connect behaviour.
 */
function createHostProxy<T extends object>(
  getHost: () => T | undefined,
  queue: PendingHostCalls,
  behaviour: HostBehaviour,
): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      if (typeof prop !== 'string')
        return undefined

      const host = getHost()
      if (host) {
        const value = (host as any)[prop]
        return typeof value === 'function' ? value.bind(host) : value
      }

      // Pre-connect behaviour.
      if (behaviour.maps.includes(prop))
        return new Map()
      if (behaviour.emitters.includes(prop))
        return createNoopEmitter()
      if (prop in behaviour.reads)
        return (..._args: any[]) => behaviour.reads[prop]!()
      if (behaviour.async.includes(prop)) {
        return (...args: any[]) => {
          const deferred = createDeferred<any>()
          queue.push(() => {
            try {
              deferred.resolve((getHost() as any)[prop](...args))
            }
            catch (error) {
              deferred.reject(error)
            }
          })
          return deferred.promise
        }
      }
      if (behaviour.handles.includes(prop)) {
        return (...args: any[]) => {
          const lazy = createLazyHandle()
          queue.push(() => {
            lazy.bind((getHost() as any)[prop](...args))
          })
          return lazy.proxy
        }
      }
      if (prop in behaviour.syncDefaults) {
        return (...args: any[]) => {
          queue.push(() => {
            ;(getHost() as any)[prop](...args)
          })
          return behaviour.syncDefaults[prop]!()
        }
      }

      // Unknown method: assume a fire-and-forget mutator, buffer it.
      return (...args: any[]) => {
        queue.push(() => {
          const resolved = getHost() as any
          if (typeof resolved?.[prop] === 'function')
            resolved[prop](...args)
        })
        return undefined
      }
    },
  })
}

/**
 * Connect-safe `diagnostics` accessor.
 *
 * `register` and `logger` emissions are buffered pre-connect;
 * `defineDiagnostics` returns a standalone terminal catalog immediately and
 * also registers its codes into the DevTools host on connect (so they surface
 * in the DevTools diagnostics UI).
 */
function createDiagnosticsProxy(
  getHost: () => DevToolsDiagnosticsHost | undefined,
  queue: PendingHostCalls,
): DevToolsDiagnosticsHost {
  const loggerProxy = new Proxy({}, {
    get(_target, code) {
      if (typeof code !== 'string')
        return undefined
      const host = getHost()
      if (host) {
        const value = (host.logger as any)[code]
        return typeof value === 'function' ? value.bind(host.logger) : value
      }
      return (...args: any[]) => {
        queue.push(() => {
          ;(getHost()?.logger as any)?.[code]?.(...args)
        })
        return undefined
      }
    },
  })

  return {
    get logger() {
      return getHost()?.logger ?? loggerProxy
    },
    register(definitions: Record<string, unknown>) {
      const host = getHost()
      if (host)
        return host.register(definitions)
      queue.push(() => getHost()?.register(definitions))
    },
    defineDiagnostics(options: any) {
      const host = getHost()
      if (host)
        return host.defineDiagnostics(options)
      const standalone = defineStandaloneDiagnostics(options)
      queue.push(() => {
        const resolved = getHost()
        if (resolved)
          resolved.register(resolved.defineDiagnostics(options))
      })
      return standalone as any
    },
  } as DevToolsDiagnosticsHost
}

/**
 * The connect-safe host accessors surfaced on `nuxt.devtools`.
 */
export interface ConnectSafeHosts {
  docks: DevToolsDockHost
  terminals: DevToolsTerminalHost
  messages: DevToolsMessagesHost
  commands: DevToolsCommandsHost
  diagnostics: DevToolsDiagnosticsHost
}

/**
 * Create the five connect-safe host accessors.
 *
 * @param getKit resolves the connected Vite DevTools context, or `undefined`.
 * @param queue  shared buffer of pre-connect mutations (flushed on connect).
 */
export function createConnectSafeHosts(
  getKit: () => ViteDevToolsNodeContext | undefined,
  queue: PendingHostCalls,
): ConnectSafeHosts {
  const docks = createHostProxy<DevToolsDockHost>(() => getKit()?.docks, queue, {
    maps: ['views'],
    emitters: ['events'],
    async: [],
    handles: ['register'],
    reads: { values: () => [] },
    syncDefaults: {},
  })

  const terminals = createHostProxy<DevToolsTerminalHost>(() => getKit()?.terminals, queue, {
    maps: ['sessions'],
    emitters: ['events'],
    async: ['startChildProcess', 'startPtySession'],
    handles: ['register'],
    reads: {},
    syncDefaults: {},
  })

  const messages = createHostProxy<DevToolsMessagesHost>(() => getKit()?.messages, queue, {
    maps: ['entries'],
    emitters: ['events'],
    async: ['add', 'update', 'remove', 'clear', 'info', 'warn', 'error', 'success', 'debug'],
    handles: [],
    reads: { listSince: () => ({ entries: [], removedIds: [], version: 0, full: true }) },
    syncDefaults: {},
  })

  const commands = createHostProxy<DevToolsCommandsHost>(() => getKit()?.commands, queue, {
    maps: ['commands'],
    emitters: ['events'],
    async: ['execute'],
    handles: ['register'],
    reads: { list: () => [] },
    syncDefaults: { unregister: () => false },
  })

  const diagnostics = createDiagnosticsProxy(() => getKit()?.diagnostics, queue)

  return { docks, terminals, messages, commands, diagnostics }
}

/**
 * Legacy compatibility pieces + deprecation hooks for {@link createConnectSafeRpc}.
 */
export interface ConnectSafeRpcOptions {
  /** The legacy broadcast proxy (`rpc.broadcast.<method>.asEvent(...)`). */
  legacyBroadcast: any
  /** The legacy server-functions proxy (`rpc.functions`). */
  legacyFunctions: any
  /** Emitted when the deprecated legacy broadcast proxy is accessed. */
  onLegacyBroadcast: (method: string) => void
  /** Emitted when the deprecated legacy `functions` proxy is accessed. */
  onLegacyFunctions: () => void
}

/**
 * Expose the devframe `RpcFunctionsHost` connect-safe on `nuxt.devtools.rpc`.
 *
 * Native members (`register`/`update`/`has`/`get`/`list`/`invokeLocal`/
 * `sharedState`/`streaming`/…) forward to the kit once connected and buffer
 * mutating calls beforehand. `broadcast` is a hybrid — callable natively
 * (`broadcast({ method, args, event })`) and still usable as the deprecated
 * `broadcast.<method>.asEvent(...)` proxy. `functions` stays the deprecated
 * legacy proxy.
 */
export function createConnectSafeRpc(
  getHost: () => RpcFunctionsHost | undefined,
  queue: PendingHostCalls,
  options: ConnectSafeRpcOptions,
): NuxtDevtoolsRpc {
  const native = createHostProxy<RpcFunctionsHost>(getHost, queue, {
    maps: ['definitions'],
    emitters: [],
    async: ['invokeLocal', 'getHandler'],
    handles: [],
    reads: {
      has: () => false,
      list: () => [],
      get: () => undefined,
      getSchema: () => ({ args: undefined, returns: undefined }),
      getCurrentRpcSession: () => undefined,
    },
    syncDefaults: {},
  })

  // Hybrid broadcast: native call form + deprecated legacy proxy access.
  const broadcast = new Proxy(function () {} as any, {
    apply(_target, _thisArg, args) {
      const host = getHost()
      if (host)
        return host.broadcast(args[0])
      const deferred = createDeferred<void>()
      queue.push(() => {
        try {
          deferred.resolve(getHost()!.broadcast(args[0]))
        }
        catch (error) {
          deferred.reject(error)
        }
      })
      return deferred.promise
    },
    get(_target, prop) {
      if (typeof prop === 'symbol' || prop in Function.prototype)
        return (Function.prototype as any)[prop]
      options.onLegacyBroadcast(String(prop))
      return options.legacyBroadcast[prop]
    },
  })

  // Deprecated legacy `functions` proxy.
  const functions = new Proxy(options.legacyFunctions, {
    get(target, prop, receiver) {
      options.onLegacyFunctions()
      return Reflect.get(target, prop, receiver)
    },
    set(target, prop, value, receiver) {
      options.onLegacyFunctions()
      return Reflect.set(target, prop, value, receiver)
    },
  })

  return new Proxy(native as any, {
    get(target, prop, receiver) {
      if (prop === 'broadcast')
        return broadcast
      if (prop === 'functions')
        return functions
      return Reflect.get(target, prop, receiver)
    },
  }) as NuxtDevtoolsRpc
}

/**
 * Replay all buffered pre-connect host calls in order, then clear the queue.
 * Call this from `connectDevToolsKit` after the context is set.
 */
export function flushPendingHostCalls(queue: PendingHostCalls): void {
  for (const call of queue)
    call()
  queue.length = 0
}
