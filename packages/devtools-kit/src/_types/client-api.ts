import type {} from '@nuxt/schema'
import type { Ref } from 'vue'
import type { AppConfig } from 'nuxt/schema'
import type { NuxtApp } from 'nuxt/dist/app/nuxt'
import type { Hookable } from 'hookable'
import type { BirpcReturn } from 'birpc'
import type { ServerFunctions } from './rpc'
import type { HookInfo, LoadingTimeMetric, PluginMetric, VueInspectorClient, VueInspectorData } from './integrations'

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

  colorMode: Ref<'dark' | 'light'>

  inspector?: {
    instance?: VueInspectorClient
    enable: () => void
    disable: () => void
    toggle: () => void
    isEnabled: Ref<boolean>
  }

  loadingTimeMetrics: LoadingTimeMetric
  getClientHooksMetrics(): HookInfo[]
  getClientPluginMetrics(): PluginMetric[]

  reloadPage(): void
  closeDevTools(): void

  /**
   * Popup the DevTools frame into Picture-in-Picture mode
   *
   * Requires Chrome 111 with experimental flag enabled.
   *
   * Function is undefined when not supported.
   *
   * @see https://developer.chrome.com/docs/web-platform/document-picture-in-picture/
   */
  popup?(): any

  /**
   * Update client, send to iframe if provided
   *
   * @internal
   */
  updateClient(iframe?: HTMLIFrameElement): NuxtDevtoolsHostClient
}

export interface NuxtDevtoolsClient {
  rpc: BirpcReturn<ServerFunctions>
  renderCodeHighlight: (code: string, lang: string, lines?: boolean, theme?: string) => {
    code: string
    supported: boolean
  }
  renderMarkdown: (markdown: string) => string
  colorMode: string

  extendClientRpc: <ServerFunctions = {}, ClientFunctions = {}>(name: string, functions: ClientFunctions) => BirpcReturn<ServerFunctions, ClientFunctions>
}

export interface NuxtDevtoolsIframeClient {
  host: NuxtDevtoolsHostClient
  devtools: NuxtDevtoolsClient
}

export interface NuxtDevtoolsGlobal {
  setClient(client: NuxtDevtoolsHostClient): void
}
