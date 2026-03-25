import type { Nitro, StorageMounts } from 'nitropack'
import type { Component, NuxtApp, NuxtLayout, NuxtOptions, NuxtPage } from 'nuxt/schema'
import type { StorageValue } from 'unstorage'
import type { ResolvedConfig } from 'vite'
import type { AnalyzeBuildsInfo } from './analyze-build'
import type { ModuleCustomTab } from './custom-tabs'
import type { AssetEntry, AssetInfo, AutoImportsWithMetadata, ComponentRelationship, HookInfo, ImageMeta, NpmCommandOptions, NpmCommandType, PackageUpdateInfo, ScannedNitroTasks, ServerRouteInfo } from './integrations'
import type { ModuleOptions, NuxtDevToolsOptions } from './options'
import type { InstallModuleReturn, ServerDebugContext } from './server-ctx'
import type { TerminalAction, TerminalInfo } from './terminals'

export interface ServerFunctions {
  // Static RPCs (can be provide on production build in the future)
  getServerConfig: () => NuxtOptions
  getServerDebugContext: () => Promise<ServerDebugContext | undefined>
  getServerData: () => Promise<NuxtServerData>
  getServerRuntimeConfig: () => Record<string, any>
  getModuleOptions: () => ModuleOptions
  getComponents: () => Component[]
  getComponentsRelationships: () => Promise<ComponentRelationship[]>
  getAutoImports: () => AutoImportsWithMetadata
  getServerPages: () => NuxtPage[]
  getCustomTabs: () => ModuleCustomTab[]
  getServerHooks: () => HookInfo[]
  getServerLayouts: () => NuxtLayout[]
  getStaticAssets: () => Promise<AssetInfo[]>
  getServerRoutes: () => ServerRouteInfo[]
  getServerTasks: () => ScannedNitroTasks | null
  getServerApp: () => NuxtApp | undefined

  // Options
  getOptions: <T extends keyof NuxtDevToolsOptions>(tab: T) => Promise<NuxtDevToolsOptions[T]>
  updateOptions: <T extends keyof NuxtDevToolsOptions>(tab: T, settings: Partial<NuxtDevToolsOptions[T]>) => Promise<void>
  clearOptions: () => Promise<void>

  // Updates
  checkForUpdateFor: (name: string) => Promise<PackageUpdateInfo | undefined>
  getNpmCommand: (command: NpmCommandType, packageName: string, options?: NpmCommandOptions) => Promise<string[] | undefined>
  runNpmCommand: (command: NpmCommandType, packageName: string, options?: NpmCommandOptions) => Promise<{ processId: string } | undefined>

  // Terminal
  getTerminals: () => TerminalInfo[]
  getTerminalDetail: (id: string) => Promise<TerminalInfo | undefined>
  runTerminalAction: (id: string, action: TerminalAction) => Promise<boolean>

  // Storage
  getStorageMounts: () => Promise<StorageMounts>
  getStorageKeys: (base?: string) => Promise<string[]>
  getStorageItem: (key: string) => Promise<StorageValue>
  setStorageItem: (key: string, value: StorageValue) => Promise<void>
  removeStorageItem: (key: string) => Promise<void>

  // Analyze
  getAnalyzeBuildInfo: () => Promise<AnalyzeBuildsInfo>
  generateAnalyzeBuildName: () => Promise<string>
  startAnalyzeBuild: (name: string) => Promise<string>
  clearAnalyzeBuilds: (names?: string[]) => Promise<void>

  // Queries
  getImageMeta: (filepath: string) => Promise<ImageMeta | undefined>
  getTextAssetContent: (filepath: string, limit?: number) => Promise<string | undefined>
  writeStaticAssets: (file: AssetEntry[], folder: string) => Promise<string[]>
  deleteStaticAsset: (filepath: string) => Promise<void>
  renameStaticAsset: (oldPath: string, newPath: string) => Promise<void>

  // Actions
  telemetryEvent: (payload: object, immediate?: boolean) => void
  customTabAction: (name: string, action: number) => Promise<boolean>
  enablePages: () => Promise<void>
  openInEditor: (filepath: string) => Promise<boolean>
  restartNuxt: (hard?: boolean) => Promise<void>
  installNuxtModule: (name: string, dry?: boolean) => Promise<InstallModuleReturn>
  uninstallNuxtModule: (name: string, dry?: boolean) => Promise<InstallModuleReturn>
  enableTimeline: (dry: boolean) => Promise<[string, string]>

  // Dev Token
  requestForAuth: (info?: string, origin?: string) => Promise<void>
  verifyAuthToken: () => Promise<boolean>
}

export interface ClientFunctions {
  refresh: (event: ClientUpdateEvent) => void
  callHook: (hook: string, ...args: any[]) => Promise<void>
  navigateTo: (path: string) => void

  onTerminalData: (_: { id: string, data: string }) => void
  onTerminalExit: (_: { id: string, code?: number }) => void
}

export interface NuxtServerData {
  nuxt: NuxtOptions
  nitro?: Nitro['options']
  vite: {
    server?: ResolvedConfig
    client?: ResolvedConfig
  }
}

export type ClientUpdateEvent = keyof ServerFunctions
