import type { ModuleCustomTab } from './custom-tabs'

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
