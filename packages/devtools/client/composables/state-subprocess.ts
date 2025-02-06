import type { AnalyzeBuildingState, InstallingModulestate } from '~/../src/types'
import { ref } from 'vue'

export const processInstallingModules = ref<InstallingModulestate[]>([])

export const processAnalyzeBuildInfo = ref<AnalyzeBuildingState | undefined>()
