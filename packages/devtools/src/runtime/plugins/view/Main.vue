<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, onMounted, reactive, ref } from 'vue'
import type { NuxtDevtoolsHostClient } from '../../../types'
import { state, togglePanel } from './state'
import { millisecondToHumanreadable, useEventListener } from './utils'
import FrameBox from './FrameBox.vue'

const props = defineProps<{
  client: NuxtDevtoolsHostClient
}>()

const PANEL_MARGIN = 10
const FRAME_MARGIN = 24
const SNAP_THRESHOLD = 2

const vars = computed(() => {
  const dark = props.client.colorMode.value === 'dark'
  return {
    '--nuxt-devtools-widget-bg': dark ? '#111' : '#ffffff',
    '--nuxt-devtools-widget-fg': dark ? '#F5F5F5' : '#111',
    '--nuxt-devtools-widget-border': dark ? '#3336' : '#efefef',
    '--nuxt-devtools-widget-shadow': dark ? 'rgba(0,0,0,0.3)' : 'rgba(128,128,128,0.1)',
  }
})

const frameBox = ref<InstanceType<typeof FrameBox>>()
const panelEl = ref<HTMLDivElement>()
const anchorEl = ref<HTMLDivElement>()

const windowSize = reactive({ width: 0, height: 0 })
const isDragging = ref(false)
const draggingOffset = reactive({ x: 0, y: 0 })
const mousePosition = reactive({ x: 0, y: 0 })

function onPointerDown(e: PointerEvent) {
  isDragging.value = true
  const { left, top, width, height } = panelEl.value!.getBoundingClientRect()
  draggingOffset.x = e.clientX - left - width / 2
  draggingOffset.y = e.clientY - top - height / 2
}

onMounted(() => {
  windowSize.width = window.innerWidth
  windowSize.height = window.innerHeight

  useEventListener(window, 'resize', () => {
    windowSize.width = window.innerWidth
    windowSize.height = window.innerHeight
  })

  useEventListener(window, 'pointermove', (e: PointerEvent) => {
    if (!isDragging.value)
      return

    const centerX = windowSize.width / 2
    const centerY = windowSize.height / 2

    const x = e.clientX - draggingOffset.x
    const y = e.clientY - draggingOffset.y

    mousePosition.x = x
    mousePosition.y = y

    // Get position
    const deg = Math.atan2(y - centerY, x - centerX)
    const HORIZONTAL_MARGIN = 70
    const TL = Math.atan2(0 - centerY + HORIZONTAL_MARGIN, 0 - centerX)
    const TR = Math.atan2(0 - centerY + HORIZONTAL_MARGIN, windowSize.width - centerX)
    const BL = Math.atan2(windowSize.height - HORIZONTAL_MARGIN - centerY, 0 - centerX)
    const BR = Math.atan2(windowSize.height - HORIZONTAL_MARGIN - centerY, windowSize.width - centerX)

    state.value.position = deg >= TL && deg <= TR
      ? 'top'
      : deg >= TR && deg <= BR
        ? 'right'
        : deg >= BR && deg <= BL
          ? 'bottom'
          : 'left'

    state.value.left = snapToPoints(x / windowSize.width * 100)
    state.value.top = snapToPoints(y / windowSize.height * 100)
  })
  useEventListener(window, 'pointerup', () => {
    isDragging.value = false
  })
  useEventListener(window, 'pointerleave', () => {
    isDragging.value = false
  })
})

function snapToPoints(value: number) {
  if (value < 5)
    return 0
  if (value > 95)
    return 100
  if (Math.abs(value - 50) < SNAP_THRESHOLD)
    return 50
  return value
}

const isVertical = computed(() => state.value.position === 'left' || state.value.position === 'right')

const anchorPos = computed(() => {
  const halfWidth = (panelEl.value?.clientWidth || 0) / 2
  const halfHeight = (panelEl.value?.clientHeight || 0) / 2

  const left = state.value.left * windowSize.width / 100
  const top = state.value.top * windowSize.height / 100

  switch (state.value.position) {
    case 'top':
      return {
        left: Math.min(Math.max(left, halfWidth + PANEL_MARGIN), windowSize.width - halfWidth - PANEL_MARGIN),
        top: PANEL_MARGIN + halfHeight,
      }
    case 'right':
      return {
        left: windowSize.width - PANEL_MARGIN - halfHeight,
        top,
      }
    case 'left':
      return {
        left: PANEL_MARGIN + halfHeight,
        top,
      }
    case 'bottom':
    default:
      return {
        left: Math.min(Math.max(left, halfWidth + PANEL_MARGIN), windowSize.width - halfWidth - PANEL_MARGIN),
        top: windowSize.height - PANEL_MARGIN - halfHeight,
      }
  }
})

const anchorStyle = computed(() => ({ left: `${anchorPos.value.left}px`, top: `${anchorPos.value.top}px` }))

const iframeStyle = computed(() => {
  // eslint-disable-next-line no-unused-expressions, no-sequences
  mousePosition.x, mousePosition.y

  const maxWidth = windowSize.width - FRAME_MARGIN * 2
  const maxHeight = windowSize.height - FRAME_MARGIN * 2

  const style: CSSProperties = {
    zIndex: -1,
    pointerEvents: isDragging.value ? 'none' : 'auto',
    width: `min(${state.value.width}vw, calc(100vw - ${FRAME_MARGIN * 2}px))`,
    height: `min(${state.value.height}vh, calc(100vh - ${FRAME_MARGIN * 2}px))`,
  }

  const anchor = anchorPos.value
  const width = Math.min(maxWidth, state.value.width * windowSize.width / 100)
  const height = Math.min(maxHeight, state.value.height * windowSize.height / 100)

  const anchorX = anchor?.left || 0
  const anchorY = anchor?.top || 0

  switch (state.value.position) {
    case 'top':
    case 'bottom':
      style.left = 0
      style.transform = 'translate(-50%, 0)'
      if ((anchorX - FRAME_MARGIN) < width / 2)
        style.left = `${width / 2 - anchorX + FRAME_MARGIN}px`
      else if ((windowSize.width - anchorX - FRAME_MARGIN) < width / 2)
        style.left = `${windowSize.width - anchorX - width / 2 - FRAME_MARGIN}px`
      break
    case 'right':
    case 'left':
      style.top = 0
      style.transform = 'translate(0, -50%)'
      if ((anchorY - FRAME_MARGIN) < height / 2)
        style.top = `${height / 2 - anchorY + FRAME_MARGIN}px`
      else if ((windowSize.height - anchorY - FRAME_MARGIN) < height / 2)
        style.top = `${windowSize.height - anchorY - height / 2 - FRAME_MARGIN}px`
      break
  }

  switch (state.value.position) {
    case 'top':
      style.top = 0
      break
    case 'right':
      style.right = 0
      break
    case 'left':
      style.left = 0
      break
    case 'bottom':
    default:
      style.bottom = 0
      break
  }

  return style
})

const time = computed(() => {
  let type = ''
  const metric = props.client.loadingTimeMetrics
  let time = -1
  if (metric.pageEnd && metric.pageStart) {
    time = metric.pageEnd - metric.pageStart
    type = 'Page'
  }
  else if (metric.appLoad && metric.appInit) {
    time = metric.appLoad - metric.appInit
    type = 'App'
  }
  if (time < 0)
    return [type, '', '-']
  return [type, ...millisecondToHumanreadable(time)]
})
</script>

<template>
  <div
    id="nuxt-devtools-anchor"
    ref="anchorEl"
    :style="[anchorStyle, vars]"
    :class="{ 'nuxt-devtools-vertical': isVertical }"
  >
    <div class="nuxt-devtools-glowing" :style="isDragging ? 'opacity: 0.6 !important' : ''" />
    <div ref="panelEl" class="nuxt-devtools-panel" @pointerdown="onPointerDown">
      <button class="nuxt-devtools-icon-button nuxt-devtools-nuxt-button" title="Toggle Nuxt DevTools" @click="togglePanel">
        <svg
          viewBox="0 0 324 324" fill="none" xmlns="http://www.w3.org/2000/svg"
          style="margin-top:-1px; height: 1.2em; width: 1.2em;"
        >
          <path d="M181.767 270H302.211C306.037 270 309.795 269.003 313.108 267.107C316.421 265.211 319.172 262.484 321.084 259.2C322.996 255.915 324.002 252.19 324 248.399C323.998 244.607 322.989 240.883 321.074 237.601L240.187 98.7439C238.275 95.4607 235.525 92.7342 232.213 90.8385C228.901 88.9429 225.143 87.9449 221.318 87.9449C217.494 87.9449 213.736 88.9429 210.424 90.8385C207.112 92.7342 204.361 95.4607 202.449 98.7439L181.767 134.272L141.329 64.7975C139.416 61.5145 136.664 58.7884 133.351 56.8931C130.038 54.9978 126.28 54 122.454 54C118.629 54 114.871 54.9978 111.558 56.8931C108.245 58.7884 105.493 61.5145 103.58 64.7975L2.92554 237.601C1.01067 240.883 0.00166657 244.607 2.06272e-06 248.399C-0.00166244 252.19 1.00407 255.915 2.91605 259.2C4.82803 262.484 7.57884 265.211 10.8918 267.107C14.2047 269.003 17.963 270 21.7886 270H97.3936C127.349 270 149.44 256.959 164.641 231.517L201.546 168.172L221.313 134.272L280.637 236.1H201.546L181.767 270ZM96.1611 236.065L43.3984 236.054L122.49 100.291L161.953 168.172L135.531 213.543C125.436 230.051 113.968 236.065 96.1611 236.065Z" fill="#00DC82" />
        </svg>
      </button>
      <div style="border-left: 1px solid #8883;width:1px;height:10px;" />
      <div class="nuxt-devtools-label" :title="`${time[0]} load time`">
        <div class="nuxt-devtools-label-main">
          {{ time[1] }}
        </div>
        <span class="nuxt-devtools-label-secondary">
          {{ time[2] }}
        </span>
      </div>
      <template v-if="client.inspector">
        <div style="border-left: 1px solid #8883;width:1px;height:10px;" />
        <button class="nuxt-devtools-icon-button" title="Toggle Component Inspector" @click="client.inspector.toggle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="height: 1.2em; width: 1.2em; opacity:0.5;"
            :style="client.inspector.isEnabled.value ? 'opacity:1;color:#00dc82' : ''"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r=".5" fill="currentColor" /><path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0-14 0m7-9v2m-9 7h2m7 7v2m7-9h2" /></g>
          </svg>
        </button>
      </template>
    </div>
    <FrameBox ref="frameBox" :client="client" :style="iframeStyle" />
  </div>
</template>

<style scoped>
#nuxt-devtools-anchor {
  width: 0;
  z-index: 2147483645;
  position: fixed;
  transform-origin: center center;
  transform: translate(-50%, -50%) rotate(0);
}

#nuxt-devtools-anchor .nuxt-devtools-label {
  padding: 0 7px 0 8px;
  font-size: 0.8em;
  line-height: 1em;
  display: flex;
  gap: 3px;
  justify-items: center;
  align-items: center;
}

#nuxt-devtools-anchor .nuxt-devtools-label .nuxt-devtools-label-main {
  opacity: 0.8;
}

#nuxt-devtools-anchor .nuxt-devtools-label .nuxt-devtools-label-secondary {
  font-size: 0.8em;
  line-height: 0.6em;
  opacity: 0.5;
}

#nuxt-devtools-anchor.nuxt-devtools-vertical .nuxt-devtools-nuxt-button {
  transform: rotate(-90deg);
}

#nuxt-devtools-anchor.nuxt-devtools-vertical .nuxt-devtools-label {
  transform: rotate(-90deg);
  flex-direction: column;
  gap: 2px;
  padding: 0 10px;
}

#nuxt-devtools-anchor .nuxt-devtools-panel {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  height: 30px;
  padding: 2px 2px 2px 4px;
  border: 1px solid var(--nuxt-devtools-widget-border);
  border-radius: 100px;
  background-color: var(--nuxt-devtools-widget-bg);
  backdrop-filter: blur(10px);
  color: var(--nuxt-devtools-widget-fg);
  box-shadow: 2px 2px 8px var(--nuxt-devtools-widget-shadow);
  transition: background 0.2s ease;
  user-select: none;
}

#nuxt-devtools-anchor.nuxt-devtools-vertical .nuxt-devtools-panel {
  transform: translate(-50%, -50%) rotate(90deg);
  box-shadow: 2px -2px 8px var(--nuxt-devtools-widget-shadow);
}

#nuxt-devtools-anchor .nuxt-devtools-icon-button {
  border-radius: 100%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
}
#nuxt-devtools-anchor .nuxt-devtools-icon-button:hover {
  opacity: 1;
}

#nuxt-devtools-anchor:hover .nuxt-devtools-glowing {
  opacity: 0.6;
}

#nuxt-devtools-anchor .nuxt-devtools-glowing {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  opacity: 0;
  transition: all 0.8s ease;
  pointer-events: none;
  z-index: -1;
  border-radius: 9999px;
  background-image: linear-gradient(45deg,#00dc82,#36e4da,#0047e1);
  filter: blur(60px);
}
</style>
