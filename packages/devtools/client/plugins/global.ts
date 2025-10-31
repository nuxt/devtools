import type { NuxtDevtoolsHostClient } from '@nuxt/devtools-kit/types'
import { defineNuxtPlugin, useRouter } from '#imports'
import { triggerRef } from 'vue'
import { useClient } from '../composables/client'
import { rpc } from '../composables/rpc'

export default defineNuxtPlugin(() => {
  const client = useClient()
  const router = useRouter()

  function onUpdateReactivity() {
    triggerRef(client)
    client.value.revision.value += 1
  }

  function onInspectorClick(path: string) {
    rpc.openInEditor(path)
  }

  function setupClient(_client: NuxtDevtoolsHostClient) {
    if (client.value === _client)
      return

    client.value = _client

    _client.hooks.hook('host:update:reactivity', onUpdateReactivity)
    _client.hooks.hook('host:inspector:click', onInspectorClick)
    _client.hooks.hook('host:action:reload', () => location.reload())
    _client.hooks.hook('host:action:navigate', (path: string) => router.push(path))

    // eslint-disable-next-line no-console
    console.log('[nuxt-devtools] Client connected', _client)
  }

  function connectParent() {
    try {
      if (window.parent === window)
        return
      if (window.parent?.__NUXT_DEVTOOLS_HOST__) {
        setupClient(window.parent.__NUXT_DEVTOOLS_HOST__)
      }
    }
    catch (error) {
      console.error('[nuxt-devtools] Failed to connect parent', error)
    }
  }

  Object.defineProperty(window, '__NUXT_DEVTOOLS_VIEW__', {
    value: {
      setClient(_client) {
        setupClient(_client)
      },
    } as typeof window['__NUXT_DEVTOOLS_VIEW__'],
    enumerable: false,
    configurable: true,
  })

  connectParent()
  setTimeout(() => connectParent(), 1000)

  router.afterEach(() => {
    const path = router.currentRoute.value?.path
    if (!path || path.includes('__'))
      return
    client.value?.hooks.callHook('devtools:navigate', path)
  })
})
