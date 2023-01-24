import type { AppConfig, Component, NuxtLayout, NuxtOptions, NuxtPage } from '@nuxt/schema'
import type { Import, UnimportMeta } from 'unimport'
import type { NuxtApp } from 'nuxt/dist/app/nuxt'
import type { RouteRecordNormalized } from 'vue-router'
import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import type { Hookable } from 'hookable'
import type { BirpcReturn } from 'birpc'

export interface ServerFunctions {
  getConfig(): NuxtOptions
  getComponents(): Component[]
  getAutoImports(): AutoImportsWithMetadata
  getServerPages(): NuxtPage[]
  getIframeTabs(): ModuleIframeTab[]
  getServerHooks(): HookInfo[]
  getLayouts(): NuxtLayout[]
  getVersions(): VersionsInfo
  startCustomTab(name: string): void
  openInEditor(filepath: string): void
}

export interface VersionsInfo {
  nuxt: string
}

export interface AutoImportsWithMetadata {
  imports: Import[]
  metadata?: UnimportMeta
}

export interface ClientFunctions {
  refresh(type: string): void
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
  contributors: GithubContributor[]
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

export interface GithubContributor {
  login: string
  name?: string
  avatar_url?: string
}

export interface ModuleIframeTab {
  icon?: string
  name: string
  title: string
  view: ModuleCustomView
  path?: string
  builtin?: boolean
  lazy?: ModuleIframeTabLazyOptions
  _loadState?: ModuleIframeTabLoadingState
}

export interface ModuleCustomView {
  type: 'iframe'
  src: string
}

export type ModuleIframeTabLoadingState = 'idle' | 'pending' | 'loaded'

export interface ModuleIframeTabLazyOptions {
  description?: string
  onLoad?: () => Promise<void>
}

export interface ModuleBuiltinTab {
  icon?: string
  name: string
  title?: string
  path?: string
  requireClient?: boolean
  requirePages?: boolean
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

export interface NuxtDevtoolsClientHooks {
  /**
   * When the devtools navigates, used for persisting the current tab
   */
  'devtools:navigate': (path: string) => void
  /**
   * Event emitted when the component inspector is updated
   */
  'host:inspector:update': (data: VueInspectorData) => void
  /**
   * Event emitted when the component inspector is clicked
   */
  'host:inspector:click': (baseUrl: string, file: string, line: number, column: number) => void
  /**
   * Event to close the component inspector
   */
  'host:inspector:close': () => void
  /**
   * Triggers reactivity manually, since Vue won't be reactive across frames)
   */
  'host:update:reactivity': () => void
}

/**
 * Host client from the App
 */
export interface NuxtDevtoolsHostClient {
  nuxt: NuxtApp
  appConfig: AppConfig

  getHooksMetrics(): HookInfo[]

  hooks: Hookable<NuxtDevtoolsClientHooks>

  inspector?: {
    instance?: VueInspectorClient
    enable: () => void
  }
}

export interface NuxtDevtoolsClient {
  rpc: BirpcReturn<ServerFunctions>
}

export interface NuxtDevtoolsIframeClient {
  host: NuxtDevtoolsHostClient
  devtools: NuxtDevtoolsClient
}

export interface NuxtDevtoolsGlobal {
  setClient(client: NuxtDevtoolsHostClient): void
}
