import type { NuxtAnalyzeMeta } from '@nuxt/schema'

export interface AnalyticBuildInfo {
  isBuilding: boolean
  lastBuild?: NuxtAnalyzeMeta
}
