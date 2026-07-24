import type { NuxtDevtoolsHostClient, TimelineEventRoute, TimelineMetrics } from '@nuxt/devtools/types'
import type { NuxtDevToolsInspectorProps } from '@nuxt/devtools/webcomponents'
import type { $Fetch } from 'ofetch'
import type { Ref } from 'vue'

import type { Router } from 'vue-router'
import { NuxtDevtoolsInspectPanel } from '@nuxt/devtools/webcomponents'
import { getDevToolsClientContext } from '@vitejs/devtools-kit/client'
import { setIframeServerContext } from '@vue/devtools-kit'

import { createHooks } from 'hookable'
import { debounce } from 'perfect-debounce'
import { events as inspectorEvents, hasData as inspectorHasData, state as inspectorState } from 'vite-plugin-vue-tracer/client/overlay'
import { computed, markRaw, nextTick, reactive, ref, shallowReactive, shallowRef, toRef, watch } from 'vue'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore tsconfig
import { useAppConfig, useRuntimeConfig } from '#imports'

import { initTimelineMetrics } from '../../function-metrics-helpers'
import { state } from './state'

const MULTIPLE_SLASHES_RE = /\/+/g

// The `Nuxt` dock group id (see `NUXT_DEVTOOLS_GROUP_ID`). Activating the group
// auto-opens its `defaultChildId` (the shared-frame anchor). The anchor iframe
// dock (`nuxt:devtools`) hosts the one kept-alive client iframe that all tab
// members soft-navigate within.
const NUXT_DOCK_GROUP_ID = 'nuxt'
const NUXT_DOCK_ANCHOR_ID = 'nuxt:devtools'

function getViteDevToolsContext() {
  return getDevToolsClientContext() as any
}

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
  let iframe: HTMLIFrameElement | undefined
  let inspector: NuxtDevtoolsHostClient['inspector'] | undefined

  const colorMode = useClientColorMode()
  const timeline = initTimelineMetrics()

  const client: NuxtDevtoolsHostClient = shallowReactive({
    nuxt: markRaw(nuxt as any),
    hooks: createHooks(),
    inspector: getInspectorInstance(),

    getIframe,
    syncClient,

    devtools: {
      toggle() {
        const ctx = getViteDevToolsContext()
        if (ctx)
          ctx.docks.toggleEntry(NUXT_DOCK_GROUP_ID)
      },
      close() {
        const ctx = getViteDevToolsContext()
        if (ctx)
          ctx.panel.store.value.open = false
      },
      open() {
        const ctx = getViteDevToolsContext()
        if (ctx) {
          ctx.panel.store.value.open = true
          ctx.docks.switchEntry(NUXT_DOCK_GROUP_ID)
        }
      },
      async navigate(path: string) {
        const ctx = getViteDevToolsContext()
        if (ctx) {
          ctx.panel.store.value.open = true
          ctx.docks.switchEntry(NUXT_DOCK_GROUP_ID)
        }
        await client.hooks.callHook('host:action:navigate', path)
      },
      async reload() {
        await client.hooks.callHook('host:action:reload')
      },
    },

    app: {
      appConfig: useAppConfig() as any,
      reload() {
        location.reload()
      },
      navigate(path: string, hard = false) {
        if (hard)
          location.href = path
        else
          router.push(path)
      },
      colorMode,
      frameState: state,
      $fetch: globalThis.$fetch as $Fetch,
    },

    metrics: {
      clientPlugins: () => window.__NUXT_DEVTOOLS_PLUGINS_METRIC__,
      clientHooks: () => Object.values(clientHooks),
      clientTimeline: () => timeline,
      loading: () => timeMetric,
    },

    revision: ref(0),
  })

  window.__NUXT_DEVTOOLS_HOST__ = client

  function syncClient() {
    if (!client.inspector)
      client.inspector = getInspectorInstance()

    try {
      iframe?.contentWindow?.__NUXT_DEVTOOLS_VIEW__?.setClient(client)
    }
    catch (e) {
      // cross-origin
      console.error('[nuxt-devtools] Failed to connect view', e)
    }
    return client
  }

  function getIframe() {
    if (!iframe) {
      const runtimeConfig = useRuntimeConfig()
      const CLIENT_BASE = '/__nuxt_devtools__/client'
      const CLIENT_PATH = `${runtimeConfig.app.baseURL.replace(CLIENT_BASE, '/')}${CLIENT_BASE}`.replace(MULTIPLE_SLASHES_RE, '/')
      const initialUrl = CLIENT_PATH + state.value.route
      iframe = document.createElement('iframe')

      // custom iframe props
      for (const [key, value] of Object.entries(runtimeConfig.app.devtools?.iframeProps || {}))
        iframe.setAttribute(key, String(value))

      iframe.id = 'nuxt-devtools-iframe'
      iframe.src = initialUrl
      iframe.onload = async () => {
        try {
          setIframeServerContext(iframe!)
          await waitForClientInjection()
          client.syncClient()
        }
        catch (e) {
          console.error('Nuxt DevTools client injection failed')
          console.error(e)
        }
      }
    }

    return iframe
  }

  function waitForClientInjection(retry = 20, timeout = 300) {
    let lastError: any
    const test = () => {
      try {
        return !!iframe?.contentWindow?.__NUXT_DEVTOOLS_VIEW__
      }
      catch (e) {
        lastError = e
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
          reject(lastError)
        }
      }, timeout)
    })
  }

  function getInspectorInstance(): NuxtDevtoolsHostClient['inspector'] {
    if (inspector)
      return inspector

    const props = reactive<NuxtDevToolsInspectorProps>({
      mouse: { x: 0, y: 0 },
      hasParent: false,
      matched: undefined,
    })

    const component = new NuxtDevtoolsInspectPanel(reactive({ props }))
    document.body.appendChild(component)
    Object.assign(component.style, {
      zIndex: 999999,
      position: 'fixed',
      left: '0',
      top: '0',
    })
    component.addEventListener('close', () => {
      props.matched = undefined
      inspectorState.isEnabled = false
      inspectorState.isVisible = false
    })
    component.addEventListener('selectParent', () => {
      const parent = inspectorState.main?.getParent()
      if (parent) {
        inspectorState.main = parent
        props.matched = parent
        nextTick(() => {
          props.hasParent = !!inspectorState.main?.getParent()
        })
      }
    })
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore WebComponent types
    component.addEventListener('openInEditor', async (e) => {
      const url = (e as any)?.detail?.[0]
      if (url)
        await client.hooks.callHook('host:inspector:click', url)
    })

    inspectorEvents.on('hover', () => {
      inspectorState.isFocused = false
      props.hasParent = !!inspectorState.main?.getParent()
    })
    inspectorEvents.on('disabled', () => {
      inspectorState.isVisible = false
      client?.hooks.callHook('host:inspector:close')
    })
    inspectorEvents.on('enabled', () => {
      inspectorState.isVisible = true
      inspectorState.isEnabled = true
    })
    inspectorEvents.on('click', async (info, e) => {
      inspectorState.isEnabled = false
      inspectorState.isFocused = true
      inspectorState.isVisible = true

      props.matched = info
      props.mouse = { x: e.clientX, y: e.clientY }
    })

    const isAvailable = ref(inspectorHasData())
    if (!isAvailable.value) {
      inspectorEvents.on('hover', async () => {
        isAvailable.value = inspectorHasData()
      })
    }

    return inspector = markRaw({
      isAvailable,
      isEnabled: toRef(inspectorState, 'isVisible'),
      enable: () => {
        inspectorState.isVisible = true
        inspectorState.isEnabled = true
      },
      disable: () => {
        inspectorState.isVisible = false
        inspectorState.isEnabled = false
      },
      toggle: () => {
        inspectorState.isEnabled = !inspectorState.isEnabled
        inspectorState.isVisible = inspectorState.isEnabled
      },
    })
  }

  setupRouteTracking(timeline, router)
  setupReactivity(client, router, timeline)
  bindVueDevToolsIframe()
  hideAnchorOnceSubTabsReady()

  clientRef.value = client

  // Shortcut to toggle devtools (opens Vite DevTools panel with Nuxt DevTools entry)
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyD' && e.altKey && e.shiftKey)
      client.devtools.toggle()
  })

  // Nuxt DevTools renders inside a single shared-frame anchor iframe in Vite
  // DevTools' dock (its per-tab members all soft-navigate within that one
  // iframe), so we never create it ourselves (`getIframe()` above is legacy).
  // The `@vue/devtools-kit` iframe messaging channel only talks to whichever
  // iframe was registered via `setIframeServerContext()` — without that, the
  // Vue DevTools applets (Pinia, component inspector, …) sit on "Connecting..."
  // forever because the host backend never learns which iframe to answer. Bind
  // it to the anchor iframe once Vite DevTools mounts it (and keep it pointed
  // there if the element is recreated).
  function bindVueDevToolsIframe() {
    let bound: HTMLIFrameElement | undefined
    const bind = () => {
      const ctx = getViteDevToolsContext()
      const dockIframe = ctx?.docks?.getStateById?.(NUXT_DOCK_ANCHOR_ID)?.domElements?.iframe as HTMLIFrameElement | null | undefined
      if (!dockIframe || dockIframe === bound)
        return
      bound = dockIframe
      iframe = dockIframe
      // The channel reads `.contentWindow` lazily on every message, so binding
      // the element once is enough even across in-iframe navigations/reloads.
      setIframeServerContext(dockIframe)
    }
    bind()
    setInterval(bind, 500)
  }

  // The shared-frame anchor (`nuxt:devtools`) must stay a selectable dock entry
  // long enough to mount its iframe and let the `devframe:frame-nav` shim
  // announce one member dock per DevTools tab (Overview, every tab, Settings) —
  // those members are what the user navigates. Once they exist the anchor's own
  // button is redundant, so we hide it by overriding its entry with a falsy
  // `when` clause (a client-dock override of the same id, which the hub merges
  // over the server entry). Overriding — rather than unregistering — keeps the
  // anchor's `subTabs`/`frameId` intact, so the frame-nav adapter and the shared
  // iframe are untouched; only the dock button disappears. We wait for members
  // first so the `Nuxt` group is never momentarily emptied (an empty group hides
  // itself).
  function hideAnchorOnceSubTabsReady() {
    const MEMBER_PREFIX = `${NUXT_DOCK_ANCHOR_ID}:`
    const timer = setInterval(() => {
      const ctx = getViteDevToolsContext()
      const meta = ctx?.docks?.getStateById?.(NUXT_DOCK_ANCHOR_ID)?.entryMeta
      if (!meta)
        return
      if (meta.when === 'false') {
        clearInterval(timer)
        return
      }
      const hasMembers = (ctx.docks.entries as any[])?.some(
        entry => typeof entry?.id === 'string' && entry.id.startsWith(MEMBER_PREFIX),
      )
      if (hasMembers) {
        ctx.docks.register({ ...meta, when: 'false' }, true)
        clearInterval(timer)
      }
    }, 500)
  }
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
  if (timeline.options.enabled && router?.currentRoute?.value?.path) {
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
    client.app.colorMode.value,
    client.metrics.loading(),
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
