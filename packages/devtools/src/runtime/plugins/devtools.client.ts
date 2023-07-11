import { shallowReactive, watchEffect } from 'vue'

import type { Router } from 'vue-router'
import { setupHooksDebug } from '../shared/hooks'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { defineNuxtPlugin, useRouter, useState } from '#imports'

export default defineNuxtPlugin((nuxt: any) => {
  if (typeof document === 'undefined' || typeof window === 'undefined')
    return

  try {
    if (window.__NUXT_DEVTOOLS_DISABLE__ || window.parent?.__NUXT_DEVTOOLS_DISABLE__)
      return

    if (parent && window.self !== parent) {
      if (parent.__NUXT_DEVTOOLS_VIEW__ || parent.document.querySelector('#nuxt-devtools-container'))
        return
    }
  }
  catch (e) {
    console.error('Nuxt DevTools: Failed to check parent window')
    console.error(e)
  }

  const timeMetric = window.__NUXT_DEVTOOLS_TIME_METRIC__ = shallowReactive(window.__NUXT_DEVTOOLS_TIME_METRIC__ || {})
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

  const ssrState = useState('__nuxt_devtools__', () => ({}))

  watchEffect(() => {
    if (ssrState.value.timeSsrStart)
      timeMetric.ssrStart = ssrState.value.timeSsrStart
  })

  import('./view/client')
    .then(({ setupDevToolsClient }) => {
      setupDevToolsClient({
        nuxt,
        clientHooks,
        timeMetric,
        router,
      })
    })
})
