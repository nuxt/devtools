import type { NuxtAnalyzeMeta } from '@nuxt/schema'

export interface AnalyzeBuildMeta extends NuxtAnalyzeMeta {
  features: {
    bundleClient?: boolean
    bundleServer?: boolean
    viteInspect?: boolean
  }
}

export interface AnalyzeBuildsInfo {
  isBuilding: boolean
  builds: AnalyzeBuildMeta[]
}
