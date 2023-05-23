import type { Component, NuxtApp, NuxtLayout, NuxtOptions, NuxtPage } from 'nuxt/schema'
import type { StorageMounts } from 'nitropack'
import type { StorageValue } from 'unstorage'
import type { NuxtDevToolsUIOptions } from './options'
import type { ModuleCustomTab } from './custom-tabs'
import type { AssetInfo, AutoImportsWithMetadata, ComponentRelationship, HookInfo, ImageMeta, NpmCommandOptions, NpmCommandType, PackageManagerName, PackageUpdateInfo, ServerRouteInfo } from './integrations'
import type { TerminalAction, TerminalInfo } from './terminals'
import type { GetWizardArgs, WizardActions } from './wizard'
import type { AnalyzeBuildsInfo } from './analyze-build'
import type { InstallModuleReturn } from './server-ctx'

export interface ServerFunctions {
  // Static RPCs (can be provide on production build in the future)
  getServerConfig(): NuxtOptions
  getComponents(): Component[]
  getComponentsRelationships(): Promise<ComponentRelationship[]>
  getAutoImports(): AutoImportsWithMetadata
  getServerPages(): NuxtPage[]
  getCustomTabs(): ModuleCustomTab[]
  getServerHooks(): HookInfo[]
  getServerLayouts(): NuxtLayout[]
  getStaticAssets(): Promise<AssetInfo[]>
  getServerRoutes(): Promise<ServerRouteInfo[]>
  getServerApp(): NuxtApp | undefined

  // Options
  getUIOptions(): Promise<NuxtDevToolsUIOptions>
  updateUIOptions(settings: Partial<NuxtDevToolsUIOptions>): Promise<void>

  // Updates
  checkForUpdateFor(name: string): Promise<PackageUpdateInfo | undefined>
  getPackageManager(): Promise<PackageManagerName>
  getNpmCommand(command: NpmCommandType, packageName: string, options?: NpmCommandOptions): Promise<string[] | undefined>
  runNpmCommand(command: NpmCommandType, packageName: string, options?: NpmCommandOptions): Promise<{ processId: string } | undefined>

  // Terminal
  getTerminals(): TerminalInfo[]
  getTerminalDetail(id: string): TerminalInfo | undefined
  runTerminalAction(id: string, action: TerminalAction): Promise<boolean>

  // Storage
  getStorageMounts(): Promise<StorageMounts>
  getStorageKeys(base?: string): Promise<string[]>
  getStorageItem(key: string): Promise<StorageValue>
  setStorageItem(key: string, value: StorageValue): Promise<void>
  removeStorageItem(key: string): Promise<void>

  // Analyze
  getAnalyzeBuildInfo(): Promise<AnalyzeBuildsInfo>
  generateAnalyzeBuildName(): Promise<string>
  startAnalyzeBuild(name: string): Promise<string>
  clearAnalyzeBuilds(names?: string[]): Promise<void>

  // Queries
  getImageMeta(filepath: string): Promise<ImageMeta | undefined>
  getTextAssetContent(filepath: string, limit?: number): Promise<string | undefined>
  writeStaticAssets(file: { name: string; data: string }[], path: string): Promise<string[]>

  // Actions
  customTabAction(name: string, action: number): Promise<boolean>
  runWizard<T extends WizardActions>(name: T, ...args: GetWizardArgs<T>): Promise<void>
  openInEditor(filepath: string): Promise<boolean>
  restartNuxt(hard?: boolean): Promise<void>
  installNuxtModule(name: string, dry?: boolean): Promise<InstallModuleReturn>
  uninstallNuxtModule(name: string, dry?: boolean): Promise<InstallModuleReturn>
}

export interface ClientFunctions {
  refresh(event: ClientUpdateEvent): void
  callHook(hook: string, ...args: any[]): Promise<void>
  navigateTo(path: string): void

  onTerminalData(_: { id: string; data: string }): void
  onTerminalExit(_: { id: string; code?: number }): void
}

export type ClientUpdateEvent = keyof ServerFunctions
