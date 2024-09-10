import { shallowReactive, watchEffect } from 'vue'

import type { TimelineServerState } from '@nuxt/devtools/types'
import type { Router } from 'vue-router'

import { setupHooksDebug } from '../shared/hooks'
// eslint-disable-next-line ts/ban-ts-comment
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

      const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac')

      // eslint-disable-next-line no-console
      console.log(
        `✨ %cNuxt DevTools %c Press Shift + ${isMac ? 'Option' : 'Alt'} + D to open DevTools`,
        'color: black; border-radius: 3px 0 0 3px; padding: 2px 2px 1px 10px; background: #00DC82',
        'border-radius: 0 3px 3px 0; padding: 2px 10px 1px 2px; background: #00DC8220',
        '',
      )
    })
})
