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
  /**
   * Unique id of the terminal session for the build currently in flight, or
   * `undefined` when idle. The client reveals this session and derives its
   * "Building…" state from it instead of an `onTerminalExit` broadcast.
   */
  activeSessionId?: string
  builds: AnalyzeBuildMeta[]
}
