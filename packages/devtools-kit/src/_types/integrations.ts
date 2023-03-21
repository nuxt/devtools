import type { RouteRecordNormalized } from 'vue-router'
import type { Import, UnimportMeta } from 'unimport'

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

export type PackageManagerName = 'npm' | 'yarn' | 'pnpm'

export type NpmCommandType = 'install' | 'uninstall' | 'update'

export interface NpmCommandOptions {
  dev?: boolean
  global?: boolean
}

export interface AutoImportsWithMetadata {
  imports: Import[]
  metadata?: UnimportMeta
}

export interface RouteInfo extends Pick<RouteRecordNormalized, 'name' | 'path' | 'meta' | 'props' | 'children'> {
  file?: string
}

export interface Payload {
  url: string
  time: number
  data?: Record<string, any>
  state?: Record<string, any>
  functions?: Record<string, any>
}

export interface PluginInfoWithMetic {
  src: string
  mode?: 'client' | 'server' | 'all'
  ssr?: boolean
  metric?: PluginMetric
}

export interface PluginMetric {
  src: string
  duration: number
}

export interface BasicModuleInfo {
  entryPath?: string
  meta?: {
    name?: string
  }
}

export interface ModuleMetric {
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
  maintainers: MaintainerInfo[]
  contributors: GitHubContributor[]
  compatibility: ModuleCompatibility
}

export interface ModuleCompatibility {
  nuxt: string
  requires: { bridge?: boolean | 'optional' }
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
  openInEditor: (baseUrl: string, file: string, line: number, column: number) => void
  onUpdated: () => void
}

export type VueInspectorData = VueInspectorClient['linkParams'] & VueInspectorClient['position']

export type AssetType = 'image' | 'font' | 'video' | 'audio' | 'text' | 'other'

export interface AssetInfo {
  path: string
  type: AssetType
  publicPath: string
  filePath: string
  size: number
  mtime: number
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
