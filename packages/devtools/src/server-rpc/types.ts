import type { Nuxt } from 'nuxt/schema'
import type { BirpcGroup } from 'birpc'
import type { ClientFunctions, ModuleOptions, ServerFunctions } from '../types'

export interface RPCContext {
  nuxt: Nuxt
  options: ModuleOptions
  birpc: BirpcGroup<ClientFunctions, ServerFunctions>
  refresh: (event: keyof ServerFunctions) => void
}
