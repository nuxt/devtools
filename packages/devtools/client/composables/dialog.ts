import type { InstallModuleReturn, ModuleStaticInfo } from '../../src/types'

export const ModuleDialog = createTemplatePromise<boolean, [info: ModuleStaticInfo, result: InstallModuleReturn, type: ModuleActionType]>()

interface RestartDialog {
  id: string
  message: string
}

export function useRestartDialogs() {
  return useState<RestartDialog[]>('devtools:restart-dialogs', () => [])
}
