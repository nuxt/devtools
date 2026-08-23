import type { LoadingTimeMetric, NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient, PluginMetric, TimelineMetrics } from '.'

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

  }

}

export {}
