import { createApp, markRaw } from 'vue'
import type { Nuxt } from '@nuxt/schema'
import { createHooks } from 'hookable'
import { setupHooksDebug } from '../shared/hooks'
import type { NuxtDevtoolsHostClient } from '../../types'
import Container from './view/Container.vue'

// @ts-expect-error runtime
import { defineNuxtPlugin } from '#app'
// @ts-expect-error runtime
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

  const client: NuxtDevtoolsHostClient = markRaw({
    nuxt: markRaw(nuxt as any),
    appConfig: useAppConfig() as any,
    getHooksMetrics: () => Object.values(clientHooks),
    hooks: createHooks(),
  })

  const holder = document.createElement('div')
  holder.id = 'nuxt-devtools-container'
  holder.setAttribute('data-v-inspector-ignore', 'true')
  document.body.appendChild(holder)

  const app = createApp(Container, { client })
  app.mount(holder)
})
