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
 * Compatibility RPC interface that supports broadcast and function access.
 * Backed by Vite DevTools Kit's RpcFunctionsHost internally.
 */
export interface NuxtDevtoolsRpc {
  /**
   * Broadcast proxy for calling client functions.
   * Supports `rpc.broadcast.refresh.asEvent(event)` pattern for backward compatibility.
   */
  broadcast: {
    [K in keyof ClientFunctions]: ClientFunctions[K] & { asEvent: ClientFunctions[K] }
  }

  /**
   * Proxy for accessing server functions locally.
   */
  functions: ServerFunctions

  /**
   * Register a server RPC function on the Vite DevTools kit.
   *
   * This is the connect-safe forward path for the devframe-native RPC
   * registration (`ctx.rpc.register(defineRpcFunction(...))`): calls made before
   * the kit connects are buffered and replayed on connect. Prefer this over the
   * deprecated {@link NuxtDevtoolsServerContext.extendServerRpc}.
   */
  register: RpcFunctionsHost['register']
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
