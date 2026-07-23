import type { Import } from 'unimport'
import type { ModuleCustomTab } from './custom-tabs'
import type { ServerRouteInfo, ServerRouteInput, ServerTaskInfo } from './integrations'

/** @deprecated Part of the removed `vscode` integration. */
export type CodeServerType = 'ms-code-cli' | 'ms-code-server' | 'coder-code-server'

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

  /** Code Server integration options. */
  codeServer?: CodeServerIntegrationOptions

  /**
   * Legacy VS Code Server integration options.
   *
   * @deprecated Use `codeServer`. Legacy modes are no longer supported.
   */
  vscode?: VSCodeIntegrationOptions

  /**
   * Enable Vue Component Inspector
   *
   * @default true
   */
  componentInspector?: boolean

  /**
   * Enable Vue DevTools integration
   */
  vueDevTools?: boolean

  /**
   * Enable vite-plugin-inspect
   *
   * @default true
   */
  viteInspect?: boolean

  /**
   * Disable the DevTools client authorization prompt, allowing any browser to
   * connect without approving it first.
   *
   * Defaults to `true` in sandboxed environments (StackBlitz, CodeSandbox).
   *
   * Note: disabling authorization lets any browser (including other devices, if
   * you expose the dev server to your LAN/WAN) connect to DevTools and access
   * your server and filesystem. Only disable it in trusted environments.
   */
  disableAuthorization?: boolean

  /**
   * Props for the iframe element, useful for environment with stricter CSP
   */
  iframeProps?: Record<string, string | boolean>

  /**
   * Experimental features
   */
  experimental?: {
    /**
     * Timeline tab
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
   * Options for assets tab
   */
  assets?: {
    /**
     * Allowed file extensions for assets tab to upload.
     * To security concern.
     *
     * Set to '*' to disbale this limitation entirely
     *
     * @default Common media and txt files
     */
    uploadExtensions?: '*' | string[]
  }

  /**
   * Enable anonymous telemetry, helping us improve Nuxt DevTools.
   *
   * By default it will respect global Nuxt telemetry settings.
   */
  telemetry?: boolean
}

export interface CodeServerIntegrationOptions {
  /**
   * Enable the Code Server integration.
   *
   * @default true
   */
  enabled?: boolean

  /** Path or command name for Coder's `code-server` binary. */
  bin?: string

  /** Workspace opened by Code Server. Defaults to the Nuxt root directory. */
  cwd?: string

  /** Port for the Code Server process. Defaults to the plugin's free-port behavior. */
  serverPort?: number

  /** Host for the Code Server process. Defaults to the plugin's loopback host. */
  host?: string

  /** Additional safe arguments passed to `code-server`. */
  args?: string[]

  /** Additional safe environment variables passed to `code-server`. */
  env?: Record<string, string>

  /** Suffix used to isolate the authenticated Code Server session cookie. */
  cookieSuffix?: string

  /** Milliseconds to wait for Code Server to become ready. */
  startTimeout?: number
}

/** @deprecated Use {@link CodeServerIntegrationOptions}. */
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

  /**
   * Determines which binary and arguments to use for VS Code.
   *
   * By default, uses the MS Code Server (ms-code-server).
   * Can alternatively use the open source Coder code-server (coder-code-server),
   * or the MS VS Code CLI (ms-code-cli)
   *  @default 'ms-code-server'
   */
  codeServer?: CodeServerType

  /**
   * Host address to listen on. Unspecified by default.
   */
  host?: string
}

/** @deprecated Tunnels are not supported by the Code Server integration. */
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
    openInEditor: string | undefined
  }
  ui: {
    componentsGraphShowGlobalComponents: boolean
    componentsGraphShowLayouts: boolean
    componentsGraphShowNodeModules: boolean
    componentsGraphShowPages: boolean
    componentsGraphShowWorkspace: boolean
    componentsView: 'list' | 'graph'
    hiddenTabCategories: string[]
    hiddenTabs: string[]
    interactionCloseOnOutsideClick: boolean
    pinnedTabs: string[]
    scale: number
    showExperimentalFeatures: boolean
    showHelpButtons: boolean
    sidebarExpanded: boolean
    sidebarScrollable: boolean
  }
  serverRoutes: {
    selectedRoute: ServerRouteInfo | null
    view: 'tree' | 'list'
    inputDefaults: Record<string, ServerRouteInput[]>
    sendFrom: 'app' | 'devtools'
  }
  serverTasks: {
    enabled: boolean
    selectedTask: ServerTaskInfo | null
    view: 'tree' | 'list'
    inputDefaults: Record<string, ServerRouteInput[]>
  }
  assets: {
    view: 'grid' | 'list'
  }
}
