import type {} from '@nuxt/schema'
import type { AppConfig } from 'nuxt/schema'
import type { NuxtApp } from 'nuxt/dist/app/nuxt'
import type { Hookable } from 'hookable'
import type { BirpcReturn } from 'birpc'
import type { ServerFunctions } from './rpc'
import type { HookInfo, PluginMetric, VueInspectorClient, VueInspectorData } from './integrations'

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
  getClientPluginMetrics(): PluginMetric[]
  closeDevTools(): void
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
