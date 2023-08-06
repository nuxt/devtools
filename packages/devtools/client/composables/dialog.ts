import type { InstallModuleReturn, ModuleActionType, ModuleStaticInfo } from '../../src/types'

export const ModuleDialog = createTemplatePromise<boolean, [info: ModuleStaticInfo, result: InstallModuleReturn, type: ModuleActionType]>()

export const AuthConfirm = createTemplatePromise<boolean>()

interface RestartDialog {
  id: string
  message: string
}

export function useRestartDialogs() {
  return useState<RestartDialog[]>('devtools:restart-dialogs', () => [])
}

let _showNotification: typeof showNotification

export function showNotification(data: {
  message: string
  icon?: string
  classes?: string
  duration?: number
}) {
  _showNotification?.(data)
}

export function provideNotificationFn(fn: typeof showNotification) {
  _showNotification = fn
}
