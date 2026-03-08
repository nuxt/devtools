// Compatibility types for nitropack v2 and nitro v3
// Defines the subset of Nitro types used by devtools, compatible with both versions.

import type { Storage } from 'unstorage'

export interface StorageMounts {
  [name: string]: {
    driver: string
    [option: string]: any
  }
}

/**
 * Merged Nitro instance type covering properties used by devtools.
 * Works with both nitropack v2 (where `storage` exists) and nitro v3 (where it was removed).
 */
export interface NitroLike {
  options: {
    storage: StorageMounts
    devStorage: StorageMounts
    handlers: Array<{
      route?: string
      handler: string
      method?: string
      middleware?: boolean
    }>
    tasks: {
      [name: string]: {
        handler: string
        description: string
      }
    }
    scheduledTasks?: Record<string, string | string[]>
    [key: string]: any
  }
  scannedHandlers: Array<{
    route?: string
    handler: string
    method?: string
    middleware?: boolean
  }>
  /** Present in nitropack v2, removed in nitro v3 */
  storage?: Storage
  [key: string]: any
}
