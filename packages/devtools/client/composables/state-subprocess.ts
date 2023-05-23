import type { AnalyzeBuildingState, InstallingModulestate } from '~/../src/types'

export const processInstallingModules = ref<InstallingModulestate[]>([])

export const processAnalyzeBuildInfo = ref<AnalyzeBuildingState | undefined>()
