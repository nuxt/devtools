import type { BirpcGroup } from 'birpc'
import type { Nuxt } from 'nuxt/schema'
import type { ClientFunctions, ServerFunctions } from './rpc'
import type { ModuleOptions } from './module-options'

/**
 * @internal
 */
export interface NuxtDevtoolsServerContext {
  nuxt: Nuxt
  options: ModuleOptions

  rpc: BirpcGroup<ClientFunctions, ServerFunctions>

  /**
   * Invalidate client cache for a function and ask for re-fetching
   */
  refresh: (event: keyof ServerFunctions) => void

  extendServerRpc: <ClientFunctions = {}, ServerFunctions = {}>(name: string, functions: ServerFunctions) => BirpcGroup<ClientFunctions, ServerFunctions>
}
