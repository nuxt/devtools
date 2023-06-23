import { shallowReactive, watchEffect } from 'vue'

import { setupHooksDebug } from '../shared/hooks'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { defineNuxtPlugin, useRouter, useState } from '#imports'

export default defineNuxtPlugin((nuxt: any) => {
  if (window.__NUXT_DEVTOOLS_DISABLE__ || window.parent?.__NUXT_DEVTOOLS_DISABLE__)
    return

  // TODO: Stackblitz support?
  if (typeof document === 'undefined' || typeof window === 'undefined')
    return

  if (window.parent && window.self !== window.parent) {
    try {
      if (window.parent.__NUXT_DEVTOOLS_VIEW__ || window.parent.document.querySelector('#nuxt-devtools-container'))
        return
    }
    catch (e) {
    }
  }

  const timeMetric = window.__NUXT_DEVTOOLS_TIME_METRIC__ = shallowReactive(window.__NUXT_DEVTOOLS_TIME_METRIC__ || {})
  timeMetric.pluginInit = Date.now()

  const clientHooks = setupHooksDebug(nuxt.hooks)
  const router = useRouter()

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
      })
    })
})
