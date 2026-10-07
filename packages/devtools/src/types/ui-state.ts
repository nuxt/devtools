import type { ModuleStaticInfo } from '@nuxt/devtools-kit/types'

export interface InstallingModulestate {
  name: string
  info: ModuleStaticInfo
  processId: string
}

export type ModuleActionType = 'install' | 'uninstall'
