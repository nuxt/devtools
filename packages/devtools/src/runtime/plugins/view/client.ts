import type { NuxtDevtoolsHostClient, TimelineEventRoute, TimelineMetrics } from '@nuxt/devtools/types'
import type { NuxtDevToolsInspectorProps } from '@nuxt/devtools/webcomponents'
import type { $Fetch } from 'ofetch'
import type { Ref } from 'vue'

import type { Router } from 'vue-router'
import { getDevframeClientContext } from '@devframes/hub/client'
import { NuxtDevtoolsInspectPanel } from '@nuxt/devtools/webcomponents'

import { createHooks } from 'hookable'
import { debounce } from 'perfect-debounce'
import { events as inspectorEvents, hasData as inspectorHasData, state as inspectorState } from 'vite-plugin-vue-tracer/client/overlay'
import { computed, effect, isRef, markRaw, nextTick, reactive, ref, shallowReactive, shallowRef, toRef } from 'vue'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore tsconfig
import { useAppConfig } from '#imports'

import { initTimelineMetrics } from '../../function-metrics-helpers'
import { isDevtoolsShortcut, watchShortcutLayoutMap } from '../../shared/shortcut'

// Host controls must update the visible Devframe viewer context, rather than
// Vite's separate dock-registration context. Target the shared-frame anchor
// explicitly so open/navigate always mounts the one kept-alive client iframe
// used by every Nuxt tab.
const NUXT_DOCK_ANCHOR_ID = 'nuxt:devtools'

function getDevframeContext() {
  return getDevframeClientContext() as any
}

function closeDevtoolsPanel() {
  const ctx = getDevframeContext()
  if (!ctx)
    return
  ctx.panel.session.open = false
  void ctx.docks.switchEntry(null)
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
  let inspector: NuxtDevtoolsHostClient['inspector'] | undefined

  const colorMode = useClientColorMode()
  const timeline = initTimelineMetrics()

  const client: NuxtDevtoolsHostClient = shallowReactive({
    nuxt: markRaw(nuxt as any),
    hooks: createHooks(),
    inspector: getInspectorInstance(),

    devtools: {
      toggle() {
        const ctx = getDevframeContext()
        if (!ctx)
          return
        if (!ctx.panel.session.open) {
          ctx.panel.session.open = true
          void ctx.docks.switchEntry(NUXT_DOCK_ANCHOR_ID)
        }
        else if (ctx.docks.selected?.id === NUXT_DOCK_ANCHOR_ID) {
          closeDevtoolsPanel()
        }
        else {
          void ctx.docks.switchEntry(NUXT_DOCK_ANCHOR_ID)
        }
      },
      close() {
        closeDevtoolsPanel()
      },
      open() {
        const ctx = getDevframeContext()
        if (ctx) {
          ctx.panel.session.open = true
          ctx.docks.switchEntry(NUXT_DOCK_ANCHOR_ID)
        }
      },
      async navigate(path: string) {
        const ctx = getDevframeContext()
        if (ctx) {
          ctx.panel.session.open = true
          ctx.docks.switchEntry(NUXT_DOCK_ANCHOR_ID)
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

  // Shortcut to toggle devtools (opens Vite DevTools panel with Nuxt DevTools entry)
  watchShortcutLayoutMap()
  window.addEventListener('keydown', (e) => {
    if (isDevtoolsShortcut(e, { shift: true }))
      client.devtools.toggle()
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
  //
  // Not a `watch(..., { deep: true })`: that re-traverses the whole payload
  // on every single mutation, so with a large payload each tick of a slider
  // bound to `useState` froze the page. Here a mutation only schedules the
  // refresh; the sources are traversed again (re-collecting dependencies)
  // once, when the changes settle.
  const runner = effect(() => {
    traverse([
      client.nuxt.payload,
      client.app.colorMode.value,
      client.metrics.loading(),
      timeMetric,
    ])
  }, {
    scheduler: debounce(() => {
      runner()
      client.hooks.callHook('host:update:reactivity')
    }, 100, { trailing: true }),
  })

  // trigger update for route change
  router?.afterEach(() => {
    refreshReactivity()
  })
  // trigger update for app mounted
  client.nuxt.hook('app:mounted', () => {
    refreshReactivity()
  })
}

/**
 * Read every nested value, so the running effect tracks all of them. Same
 * coverage as a deep `watch`: refs, arrays, Maps, Sets and plain objects.
 */
function traverse(value: unknown, seen = new Set<unknown>()): void {
  if (!value || typeof value !== 'object' || seen.has(value) || (value as any).__v_skip)
    return
  seen.add(value)
  if (isRef(value)) {
    traverse(value.value, seen)
  }
  else if (Array.isArray(value)) {
    for (const item of value)
      traverse(item, seen)
  }
  else if (value instanceof Map || value instanceof Set) {
    value.forEach((item: unknown) => traverse(item, seen))
  }
  else if (Object.prototype.toString.call(value) === '[object Object]') {
    for (const key in value)
      traverse((value as Record<string, unknown>)[key], seen)
  }
}
