<script setup lang="ts">
import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import type { PropType } from 'vue'
import { computed, ref, watch, watchEffect } from 'vue'
import type { NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient, NuxtDevtoolsGlobal as NuxtDevtoolsViewGlobal } from '../../../types'
import { PANEL_MAX, PANEL_MIN, PANEL_PADDING, closePanel, state, viewMode } from './state'
import { useEventListener } from './utils'

// Can't use reactivity transform here because this file is shipped as-is,
// where we can't guarantee that the user has the reactivity transform enabled.
// Same for not using auto imports.
const props = defineProps({
  client: Object as PropType<NuxtDevtoolsHostClient>,
})

const CLIENT_PATH = '/__nuxt_devtools__/client'

const initialUrl = CLIENT_PATH + state.value.route
const iframe = ref<HTMLIFrameElement>()
const isDragging = ref<false | 'vertical' | 'horizontal' | 'both'>(false)

const frameStyle = computed(() => {
  if (viewMode.value === 'component-inspector') {
    return {
      bottom: `${PANEL_PADDING}px`,
      left: '50%',
      transform: 'translateX(-50%)',
      height: '80px',
      width: '400px',
    }
  }

  const height = `calc(${state.value.height}vh - ${PANEL_PADDING * 2}px)`
  const width = `calc(${state.value.width}vw - ${PANEL_PADDING * 2}px)`

  if (state.value.position === 'left' || state.value.position === 'right') {
    return {
      [state.value.position]: `${PANEL_PADDING}px`,
      borderRadius: '0.5rem',
      top: `calc(${(100 - state.value.height) / 2}vh + ${PANEL_PADDING}px)`,
      height,
      width,
    }
  }
  else {
    return {
      [state.value.position || 'bottom']: `${PANEL_PADDING}px`,
      borderRadius: '0.5rem',
      left: `calc(${(100 - state.value.width) / 2}vw + ${PANEL_PADDING}px)`,
      height,
      width,
    }
  }
})

async function onLoad() {
  await waitForClientInjection()
  setupClient()
}

function waitForClientInjection(retry = 10, timeout = 200) {
  const test = () => !!iframe.value?.contentWindow?.__NUXT_DEVTOOLS_VIEW__

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

function refreshReactivity() {
  props.client?.hooks.callHook('host:update:reactivity')
}

function setupClient() {
  // trigger update for payload change
  watch(() => props.client?.nuxt.payload, () => {
    refreshReactivity()
  }, { deep: true })

  // trigger update for route change
  props.client?.nuxt.vueApp.config.globalProperties?.$router?.afterEach(() => {
    refreshReactivity()
  })

  // trigger update for app mounted
  props.client?.nuxt.hook('app:mounted', () => {
    refreshReactivity()
  })

  updateClient()
}

function updateClient() {
  const injection = iframe.value?.contentWindow?.__NUXT_DEVTOOLS_VIEW__ as NuxtDevtoolsViewGlobal
  const componentInspector = window.__VUE_INSPECTOR__ as VueInspectorClient

  if (componentInspector) {
    componentInspector.openInEditor = async (baseUrl, file, line, column) => {
      disableComponentInspector()
      await props.client!.hooks.callHook('host:inspector:click', baseUrl, file, line, column)
    }
    componentInspector.onUpdated = () => {
      props.client!.hooks.callHook('host:inspector:update', {
        ...componentInspector.linkParams,
        ...componentInspector.position,
      })
    }
  }

  injection?.setClient({
    ...props.client as any,
    inspector: {
      enable: enableComponentInspector,
      disable: disableComponentInspector,
      instance: componentInspector,
    },
  })

  props.client?.hooks.hook('devtools:navigate', (path) => {
    state.value.route = path
  })
}

function enableComponentInspector() {
  window.__VUE_INSPECTOR__?.enable()
  viewMode.value = 'component-inspector'
}

function disableComponentInspector() {
  if (!window.__VUE_INSPECTOR__?.enabled)
    return

  window.__VUE_INSPECTOR__?.disable()
  props.client?.hooks.callHook('host:inspector:close')
  if (viewMode.value === 'component-inspector')
    viewMode.value = 'default'
}

useEventListener(window, 'mousemove', (e: MouseEvent) => {
  if (!isDragging.value)
    return

  const alignSide = state.value.position === 'left' || state.value.position === 'right'

  if (isDragging.value === 'horizontal' || isDragging.value === 'both') {
    const y = state.value.position === 'top'
      ? window.innerHeight - e.clientY
      : e.clientY
    const boxHeight = window.innerHeight - PANEL_PADDING * 2
    const value = alignSide
      ? (Math.abs(y - (window.innerHeight / 2)) - PANEL_PADDING) / boxHeight * 100 * 2
      : (window.innerHeight - y - PANEL_PADDING) / boxHeight * 100
    state.value.height = Math.min(PANEL_MAX, Math.max(PANEL_MIN, value))
  }

  if (isDragging.value === 'vertical' || isDragging.value === 'both') {
    const x = state.value.position === 'left'
      ? window.innerWidth - e.clientX
      : e.clientX
    const boxWidth = window.innerWidth - PANEL_PADDING * 2
    const value = alignSide
      ? (window.innerWidth - x - PANEL_PADDING) / boxWidth * 100
      : (Math.abs(x - (window.innerWidth / 2)) - PANEL_PADDING) / boxWidth * 100 * 2
    state.value.width = Math.min(PANEL_MAX, Math.max(PANEL_MIN, value))
  }
})

useEventListener(window, 'mouseup', () => {
  isDragging.value = false
})

useEventListener(window, 'mouseleave', () => {
  isDragging.value = false
})

useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && (viewMode.value === 'component-inspector' || window.__VUE_INSPECTOR__?.enabled)) {
    disableComponentInspector()
    closePanel()
  }
})

// Close panel on outside click (when enabled)
useEventListener(window, 'mousedown', (e: MouseEvent) => {
  if (!state.value.closeOnOutsideClick)
    return
  if (!state.value.open || isDragging.value || viewMode.value !== 'default')
    return

  const matched = e.composedPath().find((_el) => {
    const el = _el as HTMLElement
    return Array.from(el.classList || []).some(c => c.startsWith('nuxt-devtools-'))
    || el.tagName?.toLowerCase() === 'iframe'
  })

  if (!matched)
    state.value.open = false
})

watch(viewMode, (mode) => {
  if (mode === 'component-inspector')
    enableComponentInspector()
  else
    disableComponentInspector()
}, { immediate: true })

watchEffect(() => {
  if (!state.value.open)
    iframe.value?.blur()
  else
    iframe.value?.focus()
})
</script>

<script lang="ts">
declare global {
  interface Window {
    __NUXT_DEVTOOLS_VIEW__?: NuxtDevtoolsViewGlobal
    __NUXT_DEVTOOLS__?: NuxtDevtoolsIframeClient
    __VUE_INSPECTOR__?: VueInspectorClient
  }
}
</script>

<template>
  <div v-show="state.open" class="nuxt-devtools-frame" :style="frameStyle">
    <iframe
      ref="iframe"
      :src="initialUrl"
      :style="{
        'pointer-events': isDragging ? 'none' : 'auto',
      }"
      @load="onLoad"
    />
    <template v-if="viewMode === 'default'">
      <div v-if="state.position !== 'top'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-horizontal" :style="{ top: 0 }" @mousedown.prevent="() => isDragging = 'horizontal'" />
      <div v-if="state.position !== 'bottom'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-horizontal" :style="{ bottom: 0 }" @mousedown.prevent="() => isDragging = 'horizontal'" />
      <div v-if="state.position !== 'left'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-vertical" :style="{ left: 0 }" @mousedown.prevent="() => isDragging = 'vertical'" />
      <div v-if="state.position !== 'right'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-vertical" :style="{ right: 0 }" @mousedown.prevent="() => isDragging = 'vertical'" />
      <div v-if="state.position !== 'top' && state.position !== 'left'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner" :style="{ top: 0, left: 0, cursor: 'nwse-resize' }" @mousedown.prevent="() => isDragging = 'both'" />
      <div v-if="state.position !== 'top' && state.position !== 'right'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner" :style="{ top: 0, right: 0, cursor: 'nesw-resize' }" @mousedown.prevent="() => isDragging = 'both'" />
      <div v-if="state.position !== 'bottom' && state.position !== 'right'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner" :style="{ bottom: 0, right: 0, cursor: 'nwse-resize' }" @mousedown.prevent="() => isDragging = 'both'" />
      <div v-if="state.position !== 'bottom' && state.position !== 'left'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner" :style="{ bottom: 0, left: 0, cursor: 'nesw-resize' }" @mousedown.prevent="() => isDragging = 'both'" />
    </template>
  </div>
</template>

<style scoped>
.nuxt-devtools-frame {
  position: fixed;
  z-index: 2147483645;
}

.nuxt-devtools-frame iframe {
  width: 100%;
  height: 100%;
  outline: none;
  border: 1px solid rgba(125,125,125,0.2);
  border-radius: 10px;
}

.nuxt-devtools-resize-handle-horizontal {
  position: absolute;
  left: 6px;
  right: 6px;
  height: 10px;
  margin: -5px 0;
  cursor: ns-resize;
  border-radius: 5px;
}
.nuxt-devtools-resize-handle-vertical {
  position: absolute;
  top: 6px;
  bottom: 0;
  width: 10px;
  margin: 0 -5px;
  cursor: ew-resize;
  border-radius: 5px;
}
.nuxt-devtools-resize-handle-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  margin: -6px;
  border-radius: 6px;
}
.nuxt-devtools-resize-handle:hover {
  background: rgba(125,125,125,0.1);
}
</style>
