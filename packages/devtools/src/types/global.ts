import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import type { LoadingTimeMetric, NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient, NuxtDevtoolsGlobal as NuxtDevtoolsViewGlobal, PluginMetric, TimelineMetrics } from '.'

declare global {
  interface Window {
    /**
     * API for module integration
     */
    __NUXT_DEVTOOLS__?: NuxtDevtoolsIframeClient

    /**
     * Nuxt DevTools client for host app
     */
    __NUXT_DEVTOOLS_HOST__?: NuxtDevtoolsHostClient

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
     * Metrics for function calls
     *
     * @internal
     */
    __NUXT_DEVTOOLS_TIMELINE_METRICS__?: TimelineMetrics

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
     * Is popup mode
     *
     * @internal
     */
    __NUXT_DEVTOOLS_IS_POPUP__?: boolean

    /**
     * Vue Inspector client
     */
    __VUE_INSPECTOR__?: VueInspectorClient

    /**
     * Vue Inspector client
     */
    __NUXT_INSPECTOR__?: VueInspectorClient

    /**
     * Experimental API: Picture-in-Picture mode
     *
     * @see https://developer.chrome.com/docs/web-platform/document-picture-in-picture/
     */
    documentPictureInPicture?: any
  }

}

export {}
