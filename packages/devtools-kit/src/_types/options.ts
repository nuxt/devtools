import type { VitePluginInspectorOptions } from 'vite-plugin-vue-inspector'
import type { Import } from 'unimport'
import type { ModuleCustomTab } from './custom-tabs'
import type { ServerRouteInfo, ServerRouteInput } from './integrations'

export interface ModuleOptions {
  /**
   * Enable DevTools
   *
   * @default true
   */
  enabled?: boolean

  /**
   * Custom tabs
   *
   * This is in static format, for dynamic injection, call `nuxt.hook('devtools:customTabs')` instead
   */
  customTabs?: ModuleCustomTab[]

  /**
   * VS Code Server integration options.
   */
  vscode?: VSCodeIntegrationOptions

  /**
   * Enable Vue Component Inspector
   *
   * @default true
   */
  componentInspector?: boolean | VitePluginInspectorOptions

  /**
   * Enable vite-plugin-inspect
   *
   * @default true
   */
  viteInspect?: boolean

  /**
   * Disable dev time authorization check.
   *
   * **NOT RECOMMENDED**, only use this if you know what you are doing.
   *
   * @see https://github.com/nuxt/devtools/pull/257
   * @default false
   */
  disableAuthorization?: boolean

  /**
   * Experimental features
   */
  experimental?: {
    /**
     * Timline tab
     * @deprecated Use `timeline.enable` instead
     */
    timeline?: boolean
  }

  /**
   * Options for the timeline tab
   */
  timeline?: {
    /**
     * Enable timeline tab
     *
     * @default false
     */
    enabled?: boolean
    /**
     * Track on function calls
     */
    functions?: {
      include?: (string | RegExp | ((item: Import) => boolean))[]
      /**
       * Include from specific modules
       *
       * @default ['#app', '@unhead/vue']
       */
      includeFrom?: string[]
      exclude?: (string | RegExp | ((item: Import) => boolean))[]
    }
  }

  /**
   * Enable anonymous telemetry, helping us improve Nuxt DevTools.
   *
   * By default it will respect global Nuxt telemetry settings.
   */
  telemetry?: boolean
}

export interface ModuleGlobalOptions {
  /**
   * List of projects to enable devtools for. Only works when devtools is installed globally.
   */
  projects?: string[]
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

export interface NuxtDevToolsOptions {
  behavior: {
    telemetry: boolean | null
  }
  ui: {
    componentsView: 'list' | 'graph'
    componentsGraphShowNodeModules: boolean
    componentsGraphShowGlobalComponents: boolean
    componentsGraphShowPages: boolean
    componentsGraphShowLayouts: boolean
    componentsGraphShowWorkspace: boolean
    interactionCloseOnOutsideClick: boolean
    showExperimentalFeatures: boolean
    showHelpButtons: boolean
    scale: number
    hiddenTabs: string[]
    hiddenTabCategories: string[]
    pinnedTabs: string[]
    minimizePanelInactive: number
    sidebarExpanded: boolean
    sidebarScrollable: boolean
  }
  serverRoutes: {
    selectedRoute: ServerRouteInfo | null
    view: 'tree' | 'list'
    inputDefaults: Record<string, ServerRouteInput[]>
  }
  assets: {
    view: 'grid' | 'list'
  }
}
