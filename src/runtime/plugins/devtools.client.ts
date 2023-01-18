import { createApp, markRaw } from 'vue'
import { setupHooksDebug } from '../shared/hooks'
import type { NuxtAppClient } from '../../types'
import Container from './view/Container.vue'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxt) => {
  // TODO: Stackblitz support?
  if (typeof document === 'undefined' || typeof window === 'undefined' || window.self !== window.top)
    return

  const clientHooks = setupHooksDebug(nuxt.hooks)

  const client: NuxtAppClient = {
    nuxt: markRaw(nuxt as any),
    appConfig: useAppConfig() as any,

    enableComponentInspector: () => {},
    onNavigate: () => {},
    getHooksMetrics: () => Object.values(clientHooks),
  }

  const holder = document.createElement('div')
  holder.setAttribute('data-v-inspector-ignore', 'true')
  document.body.appendChild(holder)

  const app = createApp(Container, { client })
  app.mount(holder)
})
