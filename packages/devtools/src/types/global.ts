import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import type { LoadingTimeMetric, NuxtDevtoolsIframeClient, NuxtDevtoolsGlobal as NuxtDevtoolsViewGlobal, PluginMetric } from '.'

declare global {
  interface Window {
    /**
     * API for module integration
     */
    __NUXT_DEVTOOLS__?: NuxtDevtoolsIframeClient

    /**
     * Nuxt DevTools for receiving host client
     *
     * @internal
     */
    __NUXT_DEVTOOLS_VIEW__?: NuxtDevtoolsViewGlobal

    /**
     * Metrics for plugin loading time
     *
     * @internal
     */
    __NUXT_DEVTOOLS_PLUGINS_METRIC__?: PluginMetric[]

    /**
     * Metrics for page / route loading time
     *
     * @internal
     */
    __NUXT_DEVTOOLS_TIME_METRIC__?: LoadingTimeMetric

    /**
     * Manually disable Nuxt DevTools embedding.
     * Used for popup mode.
     *
     * @internal
     */
    __NUXT_DEVTOOLS_DISABLE__?: boolean

    /**
     * Vue Inspector client
     */
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
