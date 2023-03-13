import type { Stream } from 'node:stream'
import type { Import, UnimportMeta } from 'unimport'
import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import type { RouteRecordNormalized } from 'vue-router'

export interface ImageMeta {
  width: number
  height: number
  orientation?: number
  type?: string
  mimeType?: string
}

export interface UpdateInfo {
  name: string
  current: string
  latest?: string
  needsUpdate?: boolean
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

export interface HookInfo {
  name: string
  start: number
  end?: number
  duration?: number
  listeners: number
  executions: number[]
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

export interface TerminalInfo {
  id: string
  name: string
  description?: string
  icon?: string
}

export interface TerminalData extends TerminalInfo {
  /**
   * Streams to be piped to the terminal
   */
  streams?: Stream[]

  /**
   * User action to restart the terminal, when not provided, this action will be disabled
   */
  onRestart?: () => Promise<void>

  /**
   * User action to terminate the terminal, when not provided, this action will be disabled
   */
  onTerminate?: () => Promise<void>

  /**
   * Content buffer
   */
  buffer?: string
}
