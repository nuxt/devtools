<script setup lang="ts">
import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import { ref } from 'vue'
import type { NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient, NuxtDevtoolsGlobal as NuxtDevtoolsViewGlobal } from '../../../types'
import { PANEL_MAX, PANEL_MIN, PANEL_PADDING, isInitialized, state } from './state'
import { useEventListener } from './utils'
import Frame from './Frame.vue'

const props = defineProps<{
  client: NuxtDevtoolsHostClient
}>()

const isDragging = ref<false | 'vertical' | 'horizontal' | 'both'>(false)

// Close panel on outside click (when enabled)
useEventListener(window, 'mousedown', (e: MouseEvent) => {
  if (!state.value.closeOnOutsideClick)
    return
  if (!state.value.open || isDragging.value || props.client.inspector?.isEnabled.value)
    return

  const matched = e.composedPath().find((_el) => {
    const el = _el as HTMLElement
    return Array.from(el.classList || []).some(c => c.startsWith('nuxt-devtools-'))
      || el.tagName?.toLowerCase() === 'iframe'
  })

  if (!matched)
    state.value.open = false
})

useEventListener(window, 'mousemove', (e: MouseEvent) => {
  if (!isDragging.value)
    return

  // REWORK THIS
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
  <div v-show="state.open && !client.inspector?.isEnabled.value" class="nuxt-devtools-frame">
    <Frame
      v-if="isInitialized"
      :client="client"
    />
    <div v-if="state.position !== 'top'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-horizontal" :style="{ top: 0 }" @mousedown.prevent="() => isDragging = 'horizontal'" />
    <div v-if="state.position !== 'bottom'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-horizontal" :style="{ bottom: 0 }" @mousedown.prevent="() => isDragging = 'horizontal'" />
    <div v-if="state.position !== 'left'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-vertical" :style="{ left: 0 }" @mousedown.prevent="() => isDragging = 'vertical'" />
    <div v-if="state.position !== 'right'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-vertical" :style="{ right: 0 }" @mousedown.prevent="() => isDragging = 'vertical'" />
    <div v-if="state.position !== 'top' && state.position !== 'left'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner" :style="{ top: 0, left: 0, cursor: 'nwse-resize' }" @mousedown.prevent="() => isDragging = 'both'" />
    <div v-if="state.position !== 'top' && state.position !== 'right'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner" :style="{ top: 0, right: 0, cursor: 'nesw-resize' }" @mousedown.prevent="() => isDragging = 'both'" />
    <div v-if="state.position !== 'bottom' && state.position !== 'right'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner" :style="{ bottom: 0, right: 0, cursor: 'nwse-resize' }" @mousedown.prevent="() => isDragging = 'both'" />
    <div v-if="state.position !== 'bottom' && state.position !== 'left'" class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner" :style="{ bottom: 0, left: 0, cursor: 'nesw-resize' }" @mousedown.prevent="() => isDragging = 'both'" />
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
