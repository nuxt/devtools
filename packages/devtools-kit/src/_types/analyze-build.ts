import type { NuxtAnalyzeMeta } from '@nuxt/schema'

export interface AnalyzeBuildMeta extends NuxtAnalyzeMeta {
  features: {
    bundleClient: boolean
    bundleNitro: boolean
    viteInspect: boolean
  }
  size: {
    clientBundle?: number
    nitroBundle?: number
  }
}

export interface AnalyzeBuildsInfo {
  isBuilding: boolean
  builds: AnalyzeBuildMeta[]
}
