import type { NuxtDevtoolsHostClient, TimelineEventRoute, TimelineMetrics } from '@nuxt/devtools/types'
import type { NuxtDevToolsInspectorProps } from '@nuxt/devtools/webcomponents'
import type { $Fetch } from 'ofetch'
import type { Ref } from 'vue'

import type { Router } from 'vue-router'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore tsconfig
import { useAppConfig } from '#imports'
import { NuxtDevtoolsInspectPanel } from '@nuxt/devtools/webcomponents'

import { createHooks } from 'hookable'
import { debounce } from 'perfect-debounce'
import { events as inspectorEvents, hasData as inspectorHasData, state as inspectorState } from 'vite-plugin-vue-tracer/client/overlay'
import { computed, markRaw, nextTick, reactive, ref, shallowReactive, shallowRef, toRef, watch } from 'vue'

import { initTimelineMetrics } from '../../function-metrics-helpers'
import { state } from './state'
import { closeNuxtDock, findNuxtDockIframe, getViteDocksContext, isNuxtDockSelected, openNuxtDock, toggleNuxtDock, waitForViteDocksContext } from './vite-dock'

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
      async toggle() {
        const docks = await waitForViteDocksContext()
        if (!docks)
          return
        await toggleNuxtDock(docks)
        state.value.open = isNuxtDockSelected(docks)
      },
      async close() {
        const docks = getViteDocksContext()
        if (!docks)
          return
        await closeNuxtDock(docks)
        state.value.open = isNuxtDockSelected(docks)
      },
      async open() {
        const docks = await waitForViteDocksContext()
        if (!docks)
          return
        await openNuxtDock(docks)
        state.value.open = isNuxtDockSelected(docks)
      },
      async navigate(path: string) {
        await client.devtools.open()
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
      getIframe()?.contentWindow?.__NUXT_DEVTOOLS_VIEW__?.setClient(client)
    }
    catch (e) {
      // cross-origin
      console.error('[nuxt-devtools] Failed to connect view', e)
    }
    return client
  }

  function getIframe() {
    iframe = findNuxtDockIframe() || iframe
    return iframe
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

  clientRef.value = client

  state.value.open = isNuxtDockSelected(getViteDocksContext())
  waitForViteDocksContext().then((docks) => {
    state.value.open = isNuxtDockSelected(docks)
  }).catch(() => {})

  // Shortcut to toggle devtools
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyD' && e.altKey && e.shiftKey)
      void client.devtools.toggle()
  })
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
