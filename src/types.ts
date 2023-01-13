import type { Component, NuxtLayout, NuxtOptions, NuxtPage } from '@nuxt/schema'
import type { Import } from 'unimport'
import type { NuxtApp } from 'nuxt/dist/app/nuxt'
import type { RouteRecordNormalized } from 'vue-router'
import type { VueInspectorClient } from 'vite-plugin-vue-inspector'

export interface ServerFunctions {
  getConfig(): NuxtOptions
  getComponents(): Component[]
  getAutoImports(): Import[]
  getServerPages(): NuxtPage[]
  getIframeTabs(): ModuleIframeTab[]
  getServerHooks(): HookInfo[]
  getLayouts(): NuxtLayout[]
  openInEditor(filepath: string): void
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
}

export interface ModuleCustomView {
  type: 'iframe'
  src: string
}

export interface ModuleBuiltinTab {
  icon?: string
  name: string
  title?: string
  path?: string
  requireClient?: boolean
}

export interface HookInfo {
  name: string
  start: number
  end?: number
  duration?: number
  listeners: number
  executions: number[]
}

export interface NuxtAppClient {
  nuxt: NuxtApp
  getHooksMetrics(): HookInfo[]

  componentInspector?: VueInspectorClient
  enableComponentInspector(): void
}

export type VueInspectorData = VueInspectorClient['linkParams'] & VueInspectorClient['position']

export interface NuxtDevtoolsGlobal {
  setClient(client: NuxtAppClient): void
  triggerUpdate(): void
  componentInspectorUpdate(data: VueInspectorData): void
  componentInspectorClick(baseUrl: string, file: string, line: number, column: number): void
  componentInspectorClose(): void
}
