<script setup lang="ts">
import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import type { NuxtAppClient, NuxtDevtoolsGlobal } from '../../../types'
import { PANEL_MAX, PANEL_MIN, PANEL_PADDING, closePanel, state, viewMode } from './state'
import { useEventListener } from './utils'

const props = defineProps({
  client: Object as PropType<NuxtAppClient>,
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
  return {
    bottom: `${PANEL_PADDING}px`,
    borderRadius: '0.5rem',
    left: `calc(${(100 - state.value.width) / 2}vw + ${PANEL_PADDING}px)`,
    height: `calc(${state.value.height}vh - ${PANEL_PADDING * 2}px)`,
    width: `calc(${state.value.width}vw - ${PANEL_PADDING * 2}px)`,
  }
})

async function onLoad() {
  await waitForClientInjection()
  setupClient()
  try {
    iframe.value.contentWindow.addEventListener('locationchange', () => {
      state.value.route = iframe.value.contentWindow.location.pathname.replace(CLIENT_PATH, '')
    })
  }
  catch (e) {
  }
}

function waitForClientInjection(retry = 10, timeout = 200) {
  const test = () => !!iframe.value?.contentWindow?.__NUXT_DEVTOOLS__

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

function setupClient() {
  // trigger update for payload change
  watch(() => props.client.nuxt.payload, () => {
    iframe.value?.contentWindow?.__NUXT_DEVTOOLS__?.triggerUpdate()
  }, { deep: true })

  // trigger update for route change
  props.client.nuxt.vueApp.config.globalProperties?.$router?.afterEach(() => {
    iframe.value?.contentWindow?.__NUXT_DEVTOOLS__?.triggerUpdate()
  })

  updateClient()
}

function updateClient() {
  const injection = iframe.value?.contentWindow?.__NUXT_DEVTOOLS__ as NuxtDevtoolsGlobal
  const componentInspector = window.__VUE_INSPECTOR__ as VueInspectorClient

  if (componentInspector) {
    componentInspector.openInEditor = (baseUrl, file, line, column) => {
      window.__NUXT_DEVTOOLS__?.componentInspectorClick(baseUrl, file, line, column)
    }
    componentInspector.onUpdated = () => {
      window.__NUXT_DEVTOOLS__?.componentInspectorUpdate({
        ...componentInspector.linkParams,
        ...componentInspector.position,
      })
    }
  }

  injection?.setClient({
    ...props.client,
    onNavigate: (route) => {
      state.value.route = route
    },
    enableComponentInspector,
    componentInspector,
  })
}

function enableComponentInspector() {
  window.__VUE_INSPECTOR__?.enable()
  viewMode.value = 'component-inspector'
}

function disableComponentInspector() {
  window.__VUE_INSPECTOR__?.disable()
  window.__NUXT_DEVTOOLS__?.componentInspectorClose()
  if (viewMode.value === 'component-inspector')
    viewMode.value = 'default'
}

useEventListener(window, 'mousemove', (e: MouseEvent) => {
  if (!isDragging.value)
    return

  if (isDragging.value === 'horizontal' || isDragging.value === 'both') {
    const fullHeight = window.innerHeight - PANEL_PADDING * 2
    const value = (window.innerHeight - e.clientY - PANEL_PADDING) / fullHeight * 100
    state.value.height = Math.min(PANEL_MAX, Math.max(PANEL_MIN, value))
  }

  if (isDragging.value === 'vertical' || isDragging.value === 'both') {
    const fullWidth = window.innerWidth - PANEL_PADDING * 2
    const halfPanelWidth = Math.abs(e.clientX - (window.innerWidth / 2)) - PANEL_PADDING
    const value = halfPanelWidth / fullWidth * 100 * 2
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
  if (e.key === 'Escape')
    closePanel()
})

watch(viewMode, (mode) => {
  if (mode === 'component-inspector')
    enableComponentInspector()
  else
    disableComponentInspector()
}, { immediate: true })
</script>

<script lang="ts">
declare global {
  interface Window {
    __NUXT_DEVTOOLS__?: NuxtDevtoolsGlobal
    __VUE_INSPECTOR__?: VueInspectorClient
  }
}
</script>

<template>
  <div v-show="state.open" class="frame" :style="frameStyle">
    <iframe
      ref="iframe"
      :src="initialUrl"
      :style="{
        'pointer-events': isDragging ? 'none' : 'auto',
      }"
      @load="onLoad"
    />
    <button class="close-button" @click="closePanel()" />
    <template v-if="viewMode === 'default'">
      <div class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-horizontal" :style="{ top: 0 }" @mousedown.prevent="() => isDragging = 'horizontal'" />
      <div class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-vertical" :style="{ left: 0 }" @mousedown.prevent="() => isDragging = 'vertical'" />
      <div class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-vertical" :style="{ right: 0 }" @mousedown.prevent="() => isDragging = 'vertical'" />
      <div class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner" :style="{ top: 0, left: 0, cursor: 'nwse-resize' }" @mousedown.prevent="() => isDragging = 'both'" />
      <div class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner" :style="{ top: 0, right: 0, cursor: 'nesw-resize' }" @mousedown.prevent="() => isDragging = 'both'" />
    </template>
  </div>
</template>

<style scoped>
.frame {
  position: fixed;
  z-index: 2147483646;
}

.frame iframe {
  width: 100%;
  height: 100%;
  outline: none;
  border: 1px solid rgba(125,125,125,0.2);
  border-radius: 0.5rem;
}

.frame .close-button {
  position: absolute;
  top: 5px;
  right: 0;
  z-index: 1;
  height: 2rem;
  width: 2rem;
  padding: 5px;
  background: transparent;
  border: none;
}

.nuxt-devtools-resize-handle-horizontal {
  position: absolute;
  top: 0;
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
  top: 0;
  width: 14px;
  height: 14px;
  margin: -6px;
  border-radius: 6px;
}
.nuxt-devtools-resize-handle:hover {
  background: rgba(125,125,125,0.1);
}
</style>
