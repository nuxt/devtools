import type { TimelineServerState } from '@nuxt/devtools/types'

import type { Router } from 'vue-router'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore tsconfig
import { defineNuxtPlugin, useRouter, useState } from '#imports'

import { shallowReactive, watchEffect } from 'vue'
import { setupHooksDebug } from '../shared/hooks'

export default defineNuxtPlugin((nuxt: any) => {
  if (typeof document === 'undefined' || typeof window === 'undefined')
    return

  try {
    if (window.__NUXT_DEVTOOLS_DISABLE__ || window.parent?.__NUXT_DEVTOOLS_DISABLE__)
      return

    if (parent && window.self !== parent) {
      if (parent.__NUXT_DEVTOOLS_VIEW__)
        return
    }
  }
  catch (e) {
    console.error('Nuxt DevTools: Failed to check parent window')
    console.error(e)
  }

  const timeMetric = shallowReactive(window.__NUXT_DEVTOOLS_TIME_METRIC__ || {})
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: timeMetric,
    enumerable: false,
    configurable: true,
  })
  timeMetric.pluginInit = Date.now()

  const clientHooks = setupHooksDebug(nuxt.hooks)
  const router = useRouter() as Router

  nuxt.hook('app:mounted', () => {
    timeMetric.appLoad = Date.now()
  })
  router.beforeEach(() => {
    timeMetric.pageStart = Date.now()
  })
  nuxt.hook('page:finish', () => {
    timeMetric.pageEnd = Date.now()
  })

  const ssrState = useState<TimelineServerState>('__nuxt_devtools__', () => ({}))

  watchEffect(() => {
    if (ssrState.value.timeSsrStart)
      timeMetric.ssrStart = ssrState.value.timeSsrStart
  })

  import('./view/client')
    .then(async ({ setupDevToolsClient }) => {
      await setupDevToolsClient({
        nuxt,
        clientHooks,
        timeMetric,
        router,
      })
    })
})
