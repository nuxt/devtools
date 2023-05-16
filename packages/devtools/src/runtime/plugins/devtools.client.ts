import { createApp, h, markRaw } from 'vue'

import type { Nuxt } from 'nuxt/schema'
import { setupHooksDebug } from '../shared/hooks'
import type { NuxtDevtoolsHostClient } from '../../types'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { defineNuxtPlugin } from '#app'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { useAppConfig } from '#imports'

export default defineNuxtPlugin((nuxt: Nuxt) => {
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

  const clientHooks = setupHooksDebug(nuxt.hooks)

  async function init() {
    const { closePanel, togglePanel } = await import('./view/state')
    const { createHooks } = await import('hookable')
    const { default: Container } = await import('./view/Container.vue')

    const client: NuxtDevtoolsHostClient = markRaw({
      nuxt: markRaw(nuxt as any),
      appConfig: useAppConfig() as any,
      hooks: createHooks(),
      getClientHooksMetrics: () => Object.values(clientHooks),
      getClientPluginMetrics: () => {
      // @ts-expect-error injected
        return globalThis.__NUXT_DEVTOOLS_PLUGINS_METRIC__ || []
      },
      reloadPage() {
        location.reload()
      },
      closeDevTools: closePanel,
    })

    const holder = document.createElement('div')
    holder.id = 'nuxt-devtools-container'
    holder.setAttribute('data-v-inspector-ignore', 'true')
    document.body.appendChild(holder)

    // Shortcut to toggle devtools
    addEventListener('keydown', (e) => {
      if (e.code === 'KeyD' && e.altKey && e.shiftKey)
        togglePanel()
    })

    const app = createApp({
      render: () => h(Container, { client }),
      devtools: {
        hide: true,
      },
    })
    app.mount(holder)
  }

  setTimeout(init, 1)
})
