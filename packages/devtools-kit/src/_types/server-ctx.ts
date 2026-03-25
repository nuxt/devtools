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
}

/**
 * @internal
 */
export interface NuxtDevtoolsServerContext {
  nuxt: Nuxt
  options: ModuleOptions

  rpc: NuxtDevtoolsRpc

  /**
   * Hook to open file in editor
   */
  openInEditorHooks: ((filepath: string) => boolean | void | Promise<boolean | void>)[]

  /**
   * Invalidate client cache for a function and ask for re-fetching
   */
  refresh: (event: keyof ServerFunctions) => void

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
