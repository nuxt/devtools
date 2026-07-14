import type {
  DevToolsCommandsHost,
  DevToolsDiagnosticsHost,
  DevToolsDockHost,
  DevToolsMessagesHost,
  DevToolsNodeContext,
  DevToolsTerminalHost,
  RpcFunctionsHost,
} from '@vitejs/devtools-kit'
import type { BirpcGroup } from 'birpc'
import type { Nuxt, NuxtDebugModuleMutationRecord } from 'nuxt/schema'
import type { ModuleOptions } from './options'
import type { ClientFunctions, ServerFunctions } from './rpc'

/**
 * The Vite DevTools RPC host (devframe `RpcFunctionsHost`), exposed connect-safe
 * on `nuxt.devtools.rpc`: `register`/`update`/`has`/`get`/`list`/`invokeLocal`/
 * `broadcast`/`sharedState`/`streaming`/… forward to the kit once connected, and
 * mutating calls made before connect are buffered and replayed.
 *
 * The two members below are overridden to keep the legacy Nuxt compatibility API
 * working (deprecated).
 */
export interface NuxtDevtoolsRpc extends Omit<RpcFunctionsHost, 'broadcast' | 'functions'> {
  /**
   * Broadcast a message to connected clients.
   *
   * Native form (preferred): `rpc.broadcast({ method, args, event })`.
   *
   * For backward compatibility it is also a proxy supporting
   * `rpc.broadcast.<method>.asEvent(...)`, but that form is **deprecated**
   * (`NDT_DEP_0007`) — use the native call form instead.
   */
  broadcast: RpcFunctionsHost['broadcast'] & {
    [K in keyof ClientFunctions]: ClientFunctions[K] & { asEvent: ClientFunctions[K] }
  }

  /**
   * Proxy for reading/writing server functions locally.
   *
   * @deprecated Use `rpc.register(...)` to add functions and `rpc.invokeLocal(...)`
   * to call them (`NDT_DEP_0007`).
   */
  functions: ServerFunctions
}

/**
 * @internal
 */
export interface NuxtDevtoolsServerContext {
  nuxt: Nuxt
  options: ModuleOptions

  rpc: NuxtDevtoolsRpc

  /**
   * The Vite DevTools Kit context, available after connection.
   *
   * Prefer the connect-safe host accessors below (`docks`, `terminals`,
   * `messages`, `commands`, `diagnostics`) — this is the raw escape hatch and is
   * `undefined` until the Vite DevTools plugin connects.
   */
  devtoolsKit: DevToolsNodeContext | undefined

  /**
   * Connect-safe accessor for the Vite DevTools **docks** host.
   *
   * Forwards to `devtoolsKit.docks` once connected. Calls made before connect
   * are buffered and replayed on connect; `register()` returns a lazy handle
   * whose `update()` is applied once the real entry exists.
   */
  docks: DevToolsDockHost

  /**
   * Connect-safe accessor for the Vite DevTools **terminals** host.
   *
   * Forwards to `devtoolsKit.terminals` once connected. Pre-connect,
   * `startChildProcess`/`startPtySession` return a promise resolving after
   * connect and `register()` returns a lazy session handle.
   */
  terminals: DevToolsTerminalHost

  /**
   * Connect-safe accessor for the Vite DevTools **messages** host.
   *
   * Forwards to `devtoolsKit.messages` once connected. Pre-connect, `add()` and
   * the level shortcuts return a promise resolving to the real handle after
   * connect.
   */
  messages: DevToolsMessagesHost

  /**
   * Connect-safe accessor for the Vite DevTools **commands** host.
   *
   * Forwards to `devtoolsKit.commands` once connected. Pre-connect, `register()`
   * returns a lazy handle and `execute()` returns a promise resolving after
   * connect.
   */
  commands: DevToolsCommandsHost

  /**
   * Connect-safe accessor for the Vite DevTools **diagnostics** host.
   *
   * Forwards to `devtoolsKit.diagnostics` once connected. Pre-connect,
   * `register()` and `logger` emissions are buffered, and `defineDiagnostics()`
   * returns a standalone (terminal) catalog whose codes are also registered into
   * the DevTools host on connect.
   */
  diagnostics: DevToolsDiagnosticsHost

  /**
   * Hook to open file in editor
   */
  openInEditorHooks: ((filepath: string) => boolean | void | Promise<boolean | void>)[]

  /**
   * Invalidate client cache for a function and ask for re-fetching
   */
  refresh: (event: keyof ServerFunctions) => void

  /**
   * @deprecated Use the Vite DevTools RPC registration instead:
   * `nuxt.devtools.rpc.register(defineRpcFunction(...))`. Kept working as a shim.
   */
  extendServerRpc: <ClientFunctions extends object = Record<string, unknown>, ServerFunctions extends object = Record<string, unknown>>(name: string, functions: ServerFunctions) => BirpcGroup<ClientFunctions, ServerFunctions>
}

export interface NuxtDevtoolsInfo {
  version: string
  packagePath: string
}

export interface InstallModuleReturn {
  configOriginal: string
  configGenerated: string
  commands: string[]
  processId: string
}

export type ServerDebugModuleMutationRecord = (Omit<NuxtDebugModuleMutationRecord, 'module'> & { name: string })

export interface ServerDebugContext {
  moduleMutationRecords: ServerDebugModuleMutationRecord[]
}
