export interface AnalyticBuild {
  buildTime: number
  dir: string
}

export interface AnalyticBuildInfo {
  isBuilding: boolean
  lastBuild?: AnalyticBuild
}
