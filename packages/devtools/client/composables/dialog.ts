import type { InstallModuleReturn, ModuleActionType, ModuleStaticInfo } from '../../src/types'
import { useState } from '#imports'
import { createTemplatePromise } from '@vueuse/core'

export const ModuleDialog = createTemplatePromise<boolean, [info: ModuleStaticInfo, result: InstallModuleReturn, type: ModuleActionType]>()

export const AuthConfirm = createTemplatePromise<boolean>()

interface RestartDialog {
  id: string
  message: string
}

export function useRestartDialogs() {
  return useState<RestartDialog[]>('devtools:restart-dialogs', () => [])
}
