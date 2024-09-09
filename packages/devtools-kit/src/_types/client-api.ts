import type {} from '@nuxt/schema'
import type { BirpcReturn } from 'birpc'
import type { Hookable } from 'hookable'
import type { NuxtApp } from 'nuxt/app'
import type { AppConfig } from 'nuxt/schema'
import type { $Fetch } from 'ofetch'
import type { BuiltinLanguage } from 'shiki'
import type { Ref } from 'vue'
import type { HookInfo, LoadingTimeMetric, PluginMetric, VueInspectorClient, VueInspectorData } from './integrations'
import type { ClientFunctions, ServerFunctions } from './rpc'
import type { TimelineMetrics } from './timeline-metrics'

export interface DevToolsFrameState {
  width: number
  height: number
  top: number
  left: number
  open: boolean
  route: string
  position: 'left' | 'right' | 'bottom' | 'top'
  closeOnOutsideClick: boolean
  minimizePanelInactive: number
}

export interface NuxtDevtoolsClientHooks {
  /**
   * When the DevTools navigates, used for persisting the current tab
   */
  'devtools:navigate': (path: string) => void
  /**
   * Event emitted when the component inspector is updated
   */
  'host:inspector:update': (data: VueInspectorData) => void
  /**
   * Event emitted when the component inspector is clicked
   */
  'host:inspector:click': (url: URL) => void
  /**
   * Event to close the component inspector
   */
  'host:inspector:close': () => void
  /**
   * Triggers reactivity manually, since Vue won't be reactive across frames)
   */
  'host:update:reactivity': () => void
  /**
   * Host action to control the DevTools navigation
   */
  'host:action:navigate': (path: string) => void
  /**
   * Host action to reload the DevTools
   */
  'host:action:reload': () => void
}

/**
 * Host client from the App
 */
export interface NuxtDevtoolsHostClient {
  nuxt: NuxtApp
  hooks: Hookable<NuxtDevtoolsClientHooks>

  getIframe: () => HTMLIFrameElement | undefined

  inspector?: {
    instance?: VueInspectorClient
    enable: () => void
    disable: () => void
    toggle: () => void
    isEnabled: Ref<boolean>
  }

  devtools: {
    close: () => void
    open: () => void
    toggle: () => void
    reload: () => void
    navigate: (path: string) => void

    /**
     * Popup the DevTools frame into Picture-in-Picture mode
     *
     * Requires Chrome 111 with experimental flag enabled.
     *
     * Function is undefined when not supported.
     *
     * @see https://developer.chrome.com/docs/web-platform/document-picture-in-picture/
     */
    popup?: () => any
  }

  app: {
    reload: () => void
    navigate: (path: string, hard?: boolean) => void
    appConfig: AppConfig
    colorMode: Ref<'dark' | 'light'>
    frameState: Ref<DevToolsFrameState>
    $fetch: $Fetch
  }

  metrics: {
    clientHooks: () => HookInfo[]
    clientPlugins: () => PluginMetric[] | undefined
    clientTimeline: () => TimelineMetrics | undefined
    loading: () => LoadingTimeMetric
  }

  /**
   * A counter to trigger reactivity updates
   */
  revision: Ref<number>

  /**
   * Update client
   * @internal
   */
  syncClient: () => NuxtDevtoolsHostClient
}

export interface NuxtDevtoolsClient {
  rpc: BirpcReturn<ServerFunctions, ClientFunctions>
  renderCodeHighlight: (code: string, lang?: BuiltinLanguage) => {
    code: string
    supported: boolean
  }
  renderMarkdown: (markdown: string) => string
  colorMode: string

  extendClientRpc: <ServerFunctions = Record<string, never>, ClientFunctions = Record<string, never>>(name: string, functions: ClientFunctions) => BirpcReturn<ServerFunctions, ClientFunctions>
}

export interface NuxtDevtoolsIframeClient {
  host: NuxtDevtoolsHostClient
  devtools: NuxtDevtoolsClient
}

export interface NuxtDevtoolsGlobal {
  setClient: (client: NuxtDevtoolsHostClient) => void
}
