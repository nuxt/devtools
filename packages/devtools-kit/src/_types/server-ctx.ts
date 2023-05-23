import type { BirpcGroup } from 'birpc'
import type { Nuxt } from 'nuxt/schema'
import type { ClientFunctions, ServerFunctions } from './rpc'
import type { ModuleOptions } from './options'

/**
 * @internal
 */
export interface NuxtDevtoolsServerContext {
  nuxt: Nuxt
  options: ModuleOptions

  rpc: BirpcGroup<ClientFunctions, ServerFunctions>

  /**
   * Hook to open file in editor
   */
  openInEditorHooks: ((filepath: string) => boolean | void | Promise<boolean | void>)[]

  /**
   * Invalidate client cache for a function and ask for re-fetching
   */
  refresh: (event: keyof ServerFunctions) => void

  extendServerRpc: <ClientFunctions = {}, ServerFunctions = {}>(name: string, functions: ServerFunctions) => BirpcGroup<ClientFunctions, ServerFunctions>
}

export interface NuxtDevtoolsInfo {
  version: string
  packagePath: string
  isGlobalInstall: boolean
}

export interface InstallModuleReturn {
  configOriginal: string
  configGenerated: string
  commands: string[]
  processId: string
}
