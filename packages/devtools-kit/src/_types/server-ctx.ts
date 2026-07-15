import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { BirpcGroup } from 'birpc'
import type { Nuxt, NuxtDebugModuleMutationRecord } from 'nuxt/schema'
import type { NuxtDevtoolsNotifyInput } from './notify'
import type { ModuleOptions } from './options'
import type { ClientFunctions, ServerFunctions } from './rpc'

/**
 * Legacy Nuxt DevTools RPC compatibility surface exposed on `nuxt.devtools.rpc`.
 *
 * For new integrations prefer {@link onDevtoolsReady}, where the connected
 * `ViteDevToolsNodeContext` gives you the full devframe `ctx.rpc`
 * (`register`/`invokeLocal`/`broadcast`/`sharedState`/…).
 */
export interface NuxtDevtoolsRpc {
  /**
   * Broadcast proxy for calling client functions.
   * Supports `rpc.broadcast.refresh.asEvent(event)` for backward compatibility.
   */
  broadcast: {
    [K in keyof ClientFunctions]: ClientFunctions[K] & { asEvent: ClientFunctions[K] }
  }

  /**
   * Proxy for reading/writing server functions locally.
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
   * The connected Vite DevTools kit context (`docks`/`terminals`/`messages`/
   * `commands`/`rpc`/`diagnostics`/…).
   *
   * This is the raw escape hatch and is `undefined` until the Vite DevTools
   * plugin connects. Prefer {@link onDevtoolsReady}, which hands you the
   * connected context.
   */
  devtoolsKit: ViteDevToolsNodeContext | undefined

  /**
   * Hook to open file in editor
   */
  openInEditorHooks: ((filepath: string) => boolean | void | Promise<boolean | void>)[]

  /**
   * Invalidate client cache for a function and ask for re-fetching
   */
  refresh: (event: keyof ServerFunctions) => void

  /**
   * Push a notification through the devframe Messages system (`ctx.messages`).
   *
   * The connected messages host surfaces it in the Vite DevTools **Messages**
   * dock and/or as a toast. Calls made before the kit connects are buffered and
   * replayed on connect. Used by the `devtools:notify` hook, the `notify` RPC
   * function and the curated built-in notification sources.
   */
  notify: (input: NuxtDevtoolsNotifyInput) => void

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
