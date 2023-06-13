import { createApp, h, markRaw, ref, shallowReactive } from 'vue'

import type { Nuxt } from 'nuxt/schema'
import { setupHooksDebug } from '../shared/hooks'
import type { NuxtDevtoolsHostClient, VueInspectorClient } from '../../types'

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
    const { default: Main } = await import('./view/Main.vue')

    const isInspecting = ref(false)
    const client: NuxtDevtoolsHostClient = shallowReactive({
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
      inspector: getInspectorInstance(),

      refreshState(): NuxtDevtoolsHostClient {
        if (!client.inspector)
          client.inspector = getInspectorInstance()
        return client
      },
    })

    function enableComponentInspector() {
      window.__VUE_INSPECTOR__?.enable()
      isInspecting.value = true
    }

    function disableComponentInspector() {
      if (!window.__VUE_INSPECTOR__?.enabled)
        return

      window.__VUE_INSPECTOR__?.disable()
      client?.hooks.callHook('host:inspector:close')
      isInspecting.value = false
    }

    function getInspectorInstance(): NuxtDevtoolsHostClient['inspector'] {
      const componentInspector = window.__VUE_INSPECTOR__ as VueInspectorClient

      if (componentInspector) {
        componentInspector.openInEditor = async (baseUrl, file, line, column) => {
          disableComponentInspector()
          await client.hooks.callHook('host:inspector:click', baseUrl, file, line, column)
        }
        componentInspector.onUpdated = () => {
          client.hooks.callHook('host:inspector:update', {
            ...componentInspector.linkParams,
            ...componentInspector.position,
          })
        }
      }
      return markRaw({
        isEnabled: isInspecting,
        enable: enableComponentInspector,
        disable: disableComponentInspector,
        toggle: () => {
          if (window.__VUE_INSPECTOR__?.enabled)
            disableComponentInspector()
          else
            enableComponentInspector()
        },
        instance: componentInspector,
      })
    }

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
      render: () => h(Main, { client }),
      devtools: {
        hide: true,
      },
    })
    app.mount(holder)
  }

  setTimeout(init, 1)
})
