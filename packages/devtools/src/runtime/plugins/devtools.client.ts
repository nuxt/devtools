import { createApp, markRaw } from 'vue'
import { createHooks } from 'hookable'
import { setupHooksDebug } from '../shared/hooks'
import type { NuxtDevtoolsHostClient } from '../../types'
import Container from './view/Container.vue'

import { closePanel, togglePanel } from './view/state'
import { defineNuxtPlugin } from '#app'
import { useAppConfig } from '#imports'

export default defineNuxtPlugin((nuxt) => {
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

  const client: NuxtDevtoolsHostClient = markRaw({
    nuxt: markRaw(nuxt as any),
    appConfig: useAppConfig() as any,
    hooks: createHooks(),
    getClientHooksMetrics: () => Object.values(clientHooks),
    closeDevTools: closePanel,
  })

  const holder = document.createElement('div')
  holder.id = 'nuxt-devtools-container'
  holder.setAttribute('data-v-inspector-ignore', 'true')
  document.body.appendChild(holder)

  // Shortcut to toggle devtools
  addEventListener('keypress', (e) => {
    if (e.code === 'KeyD' && e.altKey)
      togglePanel()
  })

  const app = createApp(Container, { client })
  app.mount(holder)
})
