import type { Component, NuxtOptions } from '@nuxt/schema'
import type { Import } from 'unimport'
import type { RouteRecordNormalized } from 'vue-router'

export interface ServerFunctions {
  getConfig(): NuxtOptions
  getComponents(): Component[]
  getAutoImports(): Import[]
  getPages(): RouteInfo[]
  getPayload(): Payload
  getCustomTabs(): ModuleCustomTab[]
  getServerHooks(): HookInfo[]
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

export interface ModuleInfo {
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

export interface ModuleCustomTab {
  icon?: string
  name: string
  title: string
  view: ModuleCustomView
  path?: string
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
}

export interface HookInfo {
  name: string
  start: number
  end?: number
  duration?: number
}
