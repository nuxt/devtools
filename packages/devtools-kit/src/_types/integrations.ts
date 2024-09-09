import type { Component } from 'nuxt/schema'
import type { Import, UnimportMeta } from 'unimport'
import type { RouteRecordNormalized } from 'vue-router'

export interface HookInfo {
  name: string
  start: number
  end?: number
  duration?: number
  listeners: number
  executions: number[]
}

export interface ImageMeta {
  width: number
  height: number
  orientation?: number
  type?: string
  mimeType?: string
}

export interface PackageUpdateInfo {
  name: string
  current: string
  latest: string
  needsUpdate: boolean
}

export type PackageManagerName = 'npm' | 'yarn' | 'pnpm' | 'bun'

export type NpmCommandType = 'install' | 'uninstall' | 'update'

export interface NpmCommandOptions {
  dev?: boolean
  global?: boolean
}

export interface AutoImportsWithMetadata {
  imports: Import[]
  metadata?: UnimportMeta
  dirs: string[]
}

export interface RouteInfo extends Pick<RouteRecordNormalized, 'name' | 'path' | 'meta' | 'props' | 'children'> {
  file?: string
}

export interface ServerRouteInfo {
  route: string
  filepath: string
  method?: string
  type: 'api' | 'route' | 'runtime' | 'collection'
  routes?: ServerRouteInfo[]
}

export type ServerRouteInputType = 'string' | 'number' | 'boolean' | 'file' | 'date' | 'time' | 'datetime-local'
export interface ServerRouteInput {
  active: boolean
  key: string
  value: any
  type?: ServerRouteInputType
}

export interface Payload {
  url: string
  time: number
  data?: Record<string, any>
  state?: Record<string, any>
  functions?: Record<string, any>
}

export interface ServerTaskInfo {
  name: string
  handler: string
  description: string
  type: 'collection' | 'task'
  tasks?: ServerTaskInfo[]
}

export interface ScannedNitroTasks {
  tasks: {
    [name: string]: {
      handler: string
      description: string
    }
  }
  scheduledTasks: {
    [cron: string]: string[]
  }
}

export interface PluginInfoWithMetic {
  src: string
  mode?: 'client' | 'server' | 'all'
  ssr?: boolean
  metric?: PluginMetric
}

export interface PluginMetric {
  src: string
  start: number
  end: number
  duration: number
}

export interface LoadingTimeMetric {
  ssrStart?: number
  appInit?: number
  appLoad?: number
  pageStart?: number
  pageEnd?: number
  pluginInit?: number
  hmrStart?: number
  hmrEnd?: number
}

export interface BasicModuleInfo {
  entryPath?: string
  meta?: {
    name?: string
  }
}

export interface InstalledModuleInfo {
  name?: string
  isPackageModule: boolean
  isUninstallable: boolean
  info?: ModuleStaticInfo
  entryPath?: string
  meta?: {
    name?: string
  }
}

export interface ModuleStaticInfo {
  name: string
  description: string
  repo: string
  npm: string
  icon?: string
  github: string
  website: string
  learn_more: string
  category: string
  type: ModuleType
  stats: ModuleStats
  maintainers: MaintainerInfo[]
  contributors: GitHubContributor[]
  compatibility: ModuleCompatibility
}

export interface ModuleCompatibility {
  nuxt: string
  requires: { bridge?: boolean | 'optional' }
}

export interface ModuleStats {
  downloads: number
  stars: number
  publishedAt: number
  createdAt: number
}

export type CompatibilityStatus = 'working' | 'wip' | 'unknown' | 'not-working'
export type ModuleType = 'community' | 'official' | '3rd-party'

export interface MaintainerInfo {
  name: string
  github: string
  twitter?: string
}

export interface GitHubContributor {
  login: string
  name?: string
  avatar_url?: string
}

export interface VueInspectorClient {
  enabled: boolean
  position: {
    x: number
    y: number
  }
  linkParams: {
    file: string
    line: number
    column: number
  }
  enable: () => void
  disable: () => void
  toggleEnabled: () => void
  openInEditor: (url: URL) => void
  onUpdated: () => void
}

export type VueInspectorData = VueInspectorClient['linkParams'] & VueInspectorClient['position']

export type AssetType = 'image' | 'font' | 'video' | 'audio' | 'text' | 'json' | 'other'

export interface AssetInfo {
  path: string
  type: AssetType
  publicPath: string
  filePath: string
  size: number
  mtime: number
  layer?: string
}

export interface AssetEntry {
  path: string
  content: string
  encoding?: BufferEncoding
  override?: boolean
}

export interface CodeSnippet {
  code: string
  lang: string
  name: string
  docs?: string
}

export interface ComponentRelationship {
  id: string
  deps: string[]
}

export interface ComponentWithRelationships {
  component: Component
  dependencies?: string[]
  dependents?: string[]
}
