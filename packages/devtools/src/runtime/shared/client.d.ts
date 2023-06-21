import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import { computed, ref } from 'vue'
import type { NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient, NuxtDevtoolsGlobal as NuxtDevtoolsViewGlobal } from '../../../types'

declare global {
  interface Window {
    /**
     * Utils injected in the DevTools UI for parent window to set client
     */
    __NUXT_DEVTOOLS_VIEW__?: NuxtDevtoolsViewGlobal
    /**
     * Url to the DevTools UI, used to open display UI in Chrome DevTools
     */
    __NUXT_DEVTOOLS_URL__?: string
    /**
     * Origin of the server served the DevTools UI. Used display assets in Chrome DevTools, which are in a different origin.
     */
    __NUXT_DEVTOOLS_SERVER_ORIGIN__?: string
    /**
     * DevTools Client
     */
    __NUXT_DEVTOOLS__?: NuxtDevtoolsIframeClient
    /**
     * Client instance for Vue Inspector
     */
    __VUE_INSPECTOR__?: VueInspectorClient
  }
}
