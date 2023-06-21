import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import type { NuxtDevtoolsIframeClient, NuxtDevtoolsGlobal as NuxtDevtoolsViewGlobal } from '../../types'

declare global {
  interface Window {
    __NUXT_DEVTOOLS_VIEW__?: NuxtDevtoolsViewGlobal
    __NUXT_DEVTOOLS__?: NuxtDevtoolsIframeClient

    /**
     * Manually disable Nuxt DevTools embedding.
     * Used for popup mode.
     */
    __NUXT_DEVTOOLS_DISABLE__?: boolean

    __VUE_INSPECTOR__?: VueInspectorClient

    /**
     * Experimental API: Picture-in-Picture mode
     *
     * @see https://developer.chrome.com/docs/web-platform/document-picture-in-picture/
     */
    documentPictureInPicture?: any
  }

}

export {}
