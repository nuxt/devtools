import type { AppConfig, Component, NuxtLayout, NuxtOptions, NuxtPage } from 'nuxt/schema'
import type { Import, UnimportMeta } from 'unimport'
import type { NuxtApp } from 'nuxt/dist/app/nuxt'
import type { RouteRecordNormalized } from 'vue-router'
import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import type { Hookable } from 'hookable'
import type { BirpcReturn } from 'birpc'
import type { VNode } from 'vue'
import type { StorageValue } from 'unstorage'
import type { StorageMounts } from 'nitropack'
import type { WizardActions, WizardArgs } from './wizard'
import type {} from '@nuxt/schema'

export interface ModuleOptions {
  /**
   * Enable DevTools
   *
   * @default true
   */
  enabled?: boolean

  /**
   * VS Code Server integration options.
   */
  vscode?: VSCodeIntegrationOptions

  /**
   * Enable Vue Component Inspector
   *
   * @default true
   */
  componentInspector?: boolean

  /**
   * Enable vite-plugin-inspect
   *
   * @default true
   */
  viteInspect?: boolean
}

export interface ModuleGlobalOptions {
  /**
   * List of projects to enable devtools for. Only works when devtools is installed globally.
   */
  projects?: string[]
}

export interface ServerFunctions {
  getStorageMounts(): Promise<StorageMounts>
  getStorageKeys(base?: string): Promise<string[]>
  getStorageItem(key: string): Promise<StorageValue>
  setStorageItem(key: string, value: StorageValue): Promise<void>
  removeStorageItem(key: string): Promise<void>
  getServerConfig(): NuxtOptions
  getComponents(): Component[]
  getComponentsRelationships(): Promise<ComponentRelationship[]>
  getAutoImports(): AutoImportsWithMetadata
  getServerPages(): NuxtPage[]
  getCustomTabs(): ModuleCustomTab[]
  getServerHooks(): HookInfo[]
  getServerLayouts(): NuxtLayout[]
  usePackageVersions(): UpdateInfo[]
  customTabAction(name: string, action: number): Promise<boolean>
  runWizard<T extends WizardActions>(name: T, ...args: WizardArgs<T>): Promise<void>
  openInEditor(filepath: string): void
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

export type ClientUpdateEvent = keyof ServerFunctions

export interface ClientFunctions {
  refresh(event: ClientUpdateEvent): void
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

export interface ModuleCustomTab {
  /**
   * The name of the tab, must be unique
   */
  name: string
  /**
   * Icon of the tab, support any Iconify icons, or a url to an image
   */
  icon?: string
  /**
   * Title of the tab
   */
  title: string
  /**
   * Main view of the tab
   */
  view: ModuleView
  /**
   * Insert static vnode to the tab entry
   *
   * Advanced options. You don't usually need this.
   */
  extraTabVNode?: VNode
}

export interface ModuleLaunchView {
  /**
   * A view for module to lazy launch some actions
   */
  type: 'launch'
  title?: string
  icon?: string
  description: string
  /**
   * Action buttons
   */
  actions: ModuleLaunchAction[]
}

export interface ModuleIframeView {
  /**
   * Iframe view
   */
  type: 'iframe'
  /**
   * Url of the iframe
   */
  src: string
  /**
   * Persist the iframe instance even if the tab is not active
   *
   * @default true
   */
  persistent?: boolean
}

export interface ModuleVNodeView {
  /**
   * Vue's VNode view
   */
  type: 'vnode'
  /**
   * Send vnode to the client, they must be static and serializable
   *
   * Call `nuxt.hook('devtools:customTabs:refresh')` to trigger manual refresh
   */
  vnode: VNode
}

export interface ModuleLaunchAction {
  /**
   * Label of the action button
   */
  label: string
  /**
   * Additional HTML attributes to the action button
   */
  attrs?: Record<string, string>
  /**
   * Indicate if the action is pending, will show a loading indicator and disable the button
   */
  pending?: boolean
  /**
   * Function to handle the action, this is executed on the server side.
   * Will automatically refresh the tabs after the action is resolved.
   */
  handle?: () => void | Promise<void>
  /**
   * Treat the action as a link, will open the link in a new tab
   */
  src?: string
}

export type ModuleView = ModuleIframeView | ModuleLaunchView | ModuleVNodeView

export interface ModuleIframeTabLazyOptions {
  description?: string
  onLoad?: () => Promise<void>
}

export interface ModuleBuiltinTab {
  name: string
  icon?: string
  title?: string
  path?: string
  requireClient?: boolean
}

export type ModuleTabInfo = ModuleCustomTab | ModuleBuiltinTab

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
  hooks: Hookable<NuxtDevtoolsClientHooks>

  inspector?: {
    instance?: VueInspectorClient
    enable: () => void
    disable: () => void
  }

  getClientHooksMetrics(): HookInfo[]
  closeDevTools(): void
}

export interface NuxtDevtoolsClient {
  rpc: BirpcReturn<ServerFunctions>
  renderCodeHighlight: (code: string, lang: string, theme?: string) => string
  renderMarkdown: (markdown: string) => string
  colorMode: string
}

export interface NuxtDevtoolsIframeClient {
  host: NuxtDevtoolsHostClient
  devtools: NuxtDevtoolsClient
}

export interface NuxtDevtoolsGlobal {
  setClient(client: NuxtDevtoolsHostClient): void
}

export interface DevToolsFrameState {
  width: number
  height: number
  bottom: number
  left: number
  open: boolean
  route: string
  position: 'left' | 'right' | 'bottom' | 'top'
}

export interface DevToolsUISettings {
  componentsView: 'list' | 'graph'
  componentsGraphShowNodeModules: boolean
  componentsGraphShowPages: boolean
  componentsGraphShowLayouts: boolean
  componentsGraphShowWorkspace: boolean
  interactionCloseOnOutsideClick: boolean
  showExperimentalFeatures: boolean
}

export interface ComponentRelationship {
  id: string
  deps: string[]
}

export interface VSCodeIntegrationOptions {
  /**
   * Enable VS Code Server integration
   */
  enabled?: boolean

  /**
   * Start VS Code Server on boot
   *
   * @default false
   */
  startOnBoot?: boolean

  /**
   * Port to start VS Code Server
   *
   * @default 3080
   */
  port?: number

  /**
   * Reuse existing server if available (same port)
   */
  reuseExistingServer?: boolean

  /**
   * Determine whether to use code-server or vs code tunnel
   *
   * @default 'local-serve'
   */
  mode?: 'local-serve' | 'tunnel'
  /**
   * Options for VS Code tunnel
   */
  tunnel?: VSCodeTunnelOptions
}

export interface VSCodeTunnelOptions {
  /**
   * the machine name for port forwarding service
   *
   * default: device hostname
   */
  name?: string
}
