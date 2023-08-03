import type { Ref } from 'vue'
import { computed, createApp, h, markRaw, nextTick, ref, shallowReactive, shallowRef, watch } from 'vue'
import { createHooks } from 'hookable'
import { debounce } from 'perfect-debounce'
import type { Router } from 'vue-router'
import type { NuxtDevtoolsHostClient, TimelineEventRoute, TimelineMetrics } from '../../../types'
import { initTimelineMetrics } from '../../function-metrics-helpers'
import Main from './Main.vue'
import { popupWindow, state } from './state'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { useAppConfig } from '#imports'

const clientRef = shallowRef<NuxtDevtoolsHostClient>()

export { clientRef as client }

export type ColorScheme = 'dark' | 'light'

export async function setupDevToolsClient({
  nuxt,
  clientHooks,
  timeMetric,
  router,
}: {
  nuxt: any
  clientHooks: any
  timeMetric: any
  router: Router
}) {
  const isInspecting = ref(false)
  const colorMode = useClientColorMode()
  const timeline = initTimelineMetrics()

  const client: NuxtDevtoolsHostClient = shallowReactive({
    nuxt: markRaw(nuxt as any),
    appConfig: useAppConfig() as any,
    hooks: createHooks(),
    getClientHooksMetrics: () => Object.values(clientHooks),
    clientPluginMetrics: window.__NUXT_DEVTOOLS_PLUGINS_METRIC__,
    clientTimelineMetrics: timeline,
    loadingTimeMetrics: timeMetric,
    reloadPage() {
      location.reload()
    },
    toggle() {
      if (state.value.open)
        client.close()
      else
        client.open()
    },
    close() {
      if (!state.value.open)
        return
      state.value.open = false
      if (popupWindow.value) {
        try {
          popupWindow.value.close()
        }
        catch (e) {
        }
        popupWindow.value = null
      }
    },
    open() {
      if (state.value.open)
        return
      state.value.open = true
      nextTick(() => {
        client.updateClient()
      })
    },
    inspector: getInspectorInstance(),
    colorMode,
    getIframe,
    updateClient,
  })

  let iframe: HTMLIFrameElement | undefined

  function updateClient() {
    if (!client.inspector)
      client.inspector = getInspectorInstance()

    client.clientPluginMetrics = window.__NUXT_DEVTOOLS_PLUGINS_METRIC__

    try {
      iframe?.contentWindow?.__NUXT_DEVTOOLS_VIEW__?.setClient(client)
    }
    catch (e) {
      // cross-origin
    }
    return client
  }

  function getIframe() {
    if (!iframe) {
      const CLIENT_PATH = '/__nuxt_devtools__/client'
      const initialUrl = CLIENT_PATH + state.value.route
      try {
        iframe = document.createElement('iframe')
        iframe.id = 'nuxt-devtools-iframe'
        iframe.src = initialUrl
        iframe.onload = async () => {
          await waitForClientInjection()
          client.updateClient()
        }
      }
      catch (e) {
        console.error(e)
      }
    }

    return iframe
  }

  function waitForClientInjection(retry = 10, timeout = 200) {
    const test = () => {
      try {
        return !!iframe?.contentWindow?.__NUXT_DEVTOOLS_VIEW__
      }
      catch (e) {

      }
      return false
    }

    if (test())
      return

    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(() => {
        if (test()) {
          clearInterval(interval)
          resolve()
        }
        else if (retry-- <= 0) {
          clearInterval(interval)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Nuxt Devtools client injection failed')
        }
      }, timeout)
    })
  }

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
    const componentInspector = window.__VUE_INSPECTOR__
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

  setupRouteTracking(timeline, router)
  setupReactivity(client, router, timeline)

  clientRef.value = client

  // Experimental: Picture-in-Picture mode
  // https://developer.chrome.com/docs/web-platform/document-picture-in-picture/
  const documentPictureInPicture = window.documentPictureInPicture
  if (documentPictureInPicture?.requestWindow) {
    client.popup = async () => {
      const iframe = getIframe()
      if (!iframe)
        return
      const pip = popupWindow.value = await documentPictureInPicture.requestWindow({
        width: Math.round(window.innerWidth * state.value.width / 100),
        height: Math.round(window.innerHeight * state.value.height / 100),
      }) as Window
      const style = pip.document.createElement('style')
      style.innerHTML = `
        body {
          margin: 0;
          padding: 0;
        }
        iframe {
          width: 100vw;
          height: 100vh;
          border: none;
          outline: none;
        }
      `
      pip.__NUXT_DEVTOOLS_DISABLE__ = true
      pip.__NUXT_DEVTOOLS_IS_POPUP__ = true
      pip.document.title = 'Nuxt DevTools'
      pip.document.head.appendChild(style)
      pip.document.body.appendChild(iframe)
      pip.addEventListener('resize', () => {
        state.value.width = Math.round(pip.innerWidth / window.innerWidth * 100)
        state.value.height = Math.round(pip.innerHeight / window.innerHeight * 100)
      })
      pip.addEventListener('pagehide', () => {
        popupWindow.value = null
        pip.close()
      })
    }
  }

  client.updateClient()

  const holder = document.createElement('div')
  holder.id = 'nuxt-devtools-container'
  holder.setAttribute('data-v-inspector-ignore', 'true')
  document.body.appendChild(holder)

  // Shortcut to toggle devtools
  addEventListener('keydown', (e) => {
    if (e.code === 'KeyD' && e.altKey && e.shiftKey)
      client.toggle()
  })

  const app = createApp({
    render: () => h(Main, { client }),
    devtools: {
      hide: true,
    },
  })
  app.mount(holder)
}

export function useClientColorMode(): Ref<ColorScheme> {
  const explicitColor = ref<ColorScheme>()
  const systemColor = ref<ColorScheme>()

  const elements = [
    document.documentElement,
    document.body,
  ]

  const ob = new MutationObserver(getExplicitColor)

  elements.forEach((el) => {
    ob.observe(el, {
      attributes: true,
      attributeFilter: ['class'],
    })
  })

  const preferDarkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const preferLightQuery = window.matchMedia('(prefers-color-scheme: light)')
  preferDarkQuery.addEventListener('change', getSystemColor)
  preferLightQuery.addEventListener('change', getSystemColor)

  function getExplicitColor() {
    let color: ColorScheme | undefined

    for (const el of elements) {
      if (el.classList.contains('dark')) {
        color = 'dark'
        break
      }
      if (el.classList.contains('light')) {
        color = 'light'
        break
      }
    }

    explicitColor.value = color
  }

  function getSystemColor() {
    if (preferDarkQuery.matches)
      systemColor.value = 'dark'
    else if (preferLightQuery.matches)
      systemColor.value = 'light'
    else
      systemColor.value = undefined
  }

  getExplicitColor()
  getSystemColor()

  return computed(() => explicitColor.value || systemColor.value || 'light')
}

function setupRouteTracking(timeline: TimelineMetrics, router: Router) {
  // Add initial route event
  if (router && timeline.options.enabled) {
    const start = timeline.events[0]?.start || Date.now()
    timeline.events.unshift({
      type: 'route',
      from: router.currentRoute.value.path,
      to: router.currentRoute.value.path,
      start,
      end: start,
    })
  }

  let lastRouteEvent: TimelineEventRoute | undefined
  router?.afterEach(() => {
    if (lastRouteEvent && !lastRouteEvent?.end)
      lastRouteEvent.end = Date.now()
  })
  router?.beforeEach((to, from) => {
    if (!timeline.options.enabled)
      return
    lastRouteEvent = {
      type: 'route',
      from: from.path,
      to: to.path,
      start: Date.now(),
    }
    timeline.events.push(lastRouteEvent)
  })
}

function setupReactivity(client: NuxtDevtoolsHostClient, router: Router | undefined, timeMetric: TimelineMetrics) {
  const refreshReactivity = debounce(() => {
    client.hooks.callHook('host:update:reactivity')
  }, 100, { trailing: true })

  // trigger update for reactivity
  watch(() => [
    client.nuxt.payload,
    client.colorMode.value,
    client.loadingTimeMetrics,
    timeMetric,
  ], () => {
    refreshReactivity()
  }, { deep: true })

  // trigger update for route change
  router?.afterEach(() => {
    refreshReactivity()
  })
  // trigger update for app mounted
  client.nuxt.hook('app:mounted', () => {
    refreshReactivity()
  })
  // record last route
  client.hooks.hook('devtools:navigate', (path) => {
    state.value.route = path
  })
}
