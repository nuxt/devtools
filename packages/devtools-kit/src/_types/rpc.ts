import type { StorageMounts } from 'nitropack'
import type { Component, NuxtApp, NuxtLayout, NuxtOptions, NuxtPage } from 'nuxt/schema'
import type { StorageValue } from 'unstorage'
import type { AnalyzeBuildsInfo } from './analyze-build'
import type { ModuleCustomTab } from './custom-tabs'
import type { AssetEntry, AssetInfo, AutoImportsWithMetadata, ComponentRelationship, HookInfo, ImageMeta, NpmCommandOptions, NpmCommandType, PackageUpdateInfo, ScannedNitroTasks, ServerRouteInfo } from './integrations'
import type { ModuleOptions, NuxtDevToolsOptions } from './options'
import type { InstallModuleReturn } from './server-ctx'
import type { TerminalAction, TerminalInfo } from './terminals'
import type { GetWizardArgs, WizardActions } from './wizard'

export interface ServerFunctions {
  // Static RPCs (can be provide on production build in the future)
  getServerConfig: () => NuxtOptions
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
  runNpmCommand: (token: string, command: NpmCommandType, packageName: string, options?: NpmCommandOptions) => Promise<{ processId: string } | undefined>

  // Terminal
  getTerminals: () => TerminalInfo[]
  getTerminalDetail: (token: string, id: string) => Promise<TerminalInfo | undefined>
  runTerminalAction: (token: string, id: string, action: TerminalAction) => Promise<boolean>

  // Storage
  getStorageMounts: () => Promise<StorageMounts>
  getStorageKeys: (base?: string) => Promise<string[]>
  getStorageItem: (token: string, key: string) => Promise<StorageValue>
  setStorageItem: (token: string, key: string, value: StorageValue) => Promise<void>
  removeStorageItem: (token: string, key: string) => Promise<void>

  // Analyze
  getAnalyzeBuildInfo: () => Promise<AnalyzeBuildsInfo>
  generateAnalyzeBuildName: () => Promise<string>
  startAnalyzeBuild: (token: string, name: string) => Promise<string>
  clearAnalyzeBuilds: (token: string, names?: string[]) => Promise<void>

  // Queries
  getImageMeta: (token: string, filepath: string) => Promise<ImageMeta | undefined>
  getTextAssetContent: (token: string, filepath: string, limit?: number) => Promise<string | undefined>
  writeStaticAssets: (token: string, file: AssetEntry[], folder: string) => Promise<string[]>
  deleteStaticAsset: (token: string, filepath: string) => Promise<void>
  renameStaticAsset: (token: string, oldPath: string, newPath: string) => Promise<void>

  // Actions
  telemetryEvent: (payload: object, immediate?: boolean) => void
  customTabAction: (name: string, action: number) => Promise<boolean>
  runWizard: <T extends WizardActions>(token: string, name: T, ...args: GetWizardArgs<T>) => Promise<void>
  openInEditor: (filepath: string) => Promise<boolean>
  restartNuxt: (token: string, hard?: boolean) => Promise<void>
  installNuxtModule: (token: string, name: string, dry?: boolean) => Promise<InstallModuleReturn>
  uninstallNuxtModule: (token: string, name: string, dry?: boolean) => Promise<InstallModuleReturn>
  enableTimeline: (dry: boolean) => Promise<[string, string]>

  // Dev Token
  requestForAuth: (info?: string, origin?: string) => Promise<void>
  verifyAuthToken: (token: string) => Promise<boolean>
}

export interface ClientFunctions {
  refresh: (event: ClientUpdateEvent) => void
  callHook: (hook: string, ...args: any[]) => Promise<void>
  navigateTo: (path: string) => void

  onTerminalData: (_: { id: string, data: string }) => void
  onTerminalExit: (_: { id: string, code?: number }) => void
}

export type ClientUpdateEvent = keyof ServerFunctions
