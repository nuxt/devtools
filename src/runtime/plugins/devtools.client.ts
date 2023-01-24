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
  if (typeof document === 'undefined' || typeof window === 'undefined' || window.self !== window.top)
    return

  const clientHooks = setupHooksDebug(nuxt.hooks)

  const client: NuxtDevtoolsHostClient = {
    nuxt: markRaw(nuxt as any),
    appConfig: useAppConfig() as any,

    enableComponentInspector: () => {},
    getHooksMetrics: () => Object.values(clientHooks),

    hooks: createHooks(),
  }

  const holder = document.createElement('div')
  holder.setAttribute('data-v-inspector-ignore', 'true')
  document.body.appendChild(holder)

  const app = createApp(Container, { client })
  app.mount(holder)
})
