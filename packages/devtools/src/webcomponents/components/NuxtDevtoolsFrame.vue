<script setup lang="ts">
import type { DevToolsFrameState, NuxtDevtoolsHostClient, NuxtDevToolsOptions } from '@nuxt/devtools/types'
import type { CSSProperties } from 'vue'
import { toRefs, useElementBounding, useEventListener, useScreenSafeArea } from '@vueuse/core'
import { computed, onMounted, reactive, ref, useTemplateRef, watchEffect } from 'vue'
import FrameBox from './NuxtDevtoolsFrameBox.vue'

const props = defineProps<{
  client: NuxtDevtoolsHostClient
  settings: {
    ui: NuxtDevToolsOptions['ui']
  }
  state: DevToolsFrameState
}>()

const {
  state,
  settings,
} = toRefs(props)

function millisecondToHumanreadable(ms: number): [number, string] {
  if (ms < 1000)
    return [+ms.toFixed(0), 'ms']
  if (ms < 1000 * 60)
    return [+(ms / 1000).toFixed(1), 's']
  if (ms < 1000 * 60 * 60)
    return [+(ms / 1000 / 60).toFixed(1), 'min']
  return [+(ms / 1000 / 60 / 60).toFixed(1), 'hour']
}

const panelMargins = reactive({
  left: 10,
  top: 10,
  right: 10,
  bottom: 10,
})

const safeArea = useScreenSafeArea()
const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')

function toNumber(value: string) {
  const num = +value
  if (Number.isNaN(num))
    return 0
  return num
}

watchEffect(() => {
  panelMargins.left = toNumber(safeArea.left.value) + 10
  panelMargins.top = toNumber(safeArea.top.value) + 10
  panelMargins.right = toNumber(safeArea.right.value) + 10
  panelMargins.bottom = toNumber(safeArea.bottom.value) + 10
})

const SNAP_THRESHOLD = 2

const vars = computed(() => {
  const dark = props.client.app.colorMode.value === 'dark'
  return {
    '--nuxt-devtools-widget-bg': dark ? '#111' : '#ffffff',
    '--nuxt-devtools-widget-fg': dark ? '#F5F5F5' : '#111',
    '--nuxt-devtools-widget-border': dark ? '#3336' : '#efefef',
    '--nuxt-devtools-widget-shadow': dark ? 'rgba(0,0,0,0.3)' : 'rgba(128,128,128,0.1)',
  }
})

const frameBox = useTemplateRef<HTMLDivElement>('frameBox')
const panelEl = useTemplateRef<HTMLDivElement>('panelEl')
const anchorEl = useTemplateRef<HTMLDivElement>('anchorEl')

const windowSize = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
})
const isDragging = ref(false)
const draggingOffset = reactive({ x: 0, y: 0 })
const mousePosition = reactive({ x: 0, y: 0 })

function onPointerDown(e: PointerEvent) {
  if (!panelEl.value)
    return
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

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    const x = e.clientX - draggingOffset.x
    const y = e.clientY - draggingOffset.y

    if (Number.isNaN(x) || Number.isNaN(y))
      return

    mousePosition.x = x
    mousePosition.y = y

    // Get position
    const deg = Math.atan2(y - centerY, x - centerX)
    const HORIZONTAL_MARGIN = 70
    const TL = Math.atan2(0 - centerY + HORIZONTAL_MARGIN, 0 - centerX)
    const TR = Math.atan2(0 - centerY + HORIZONTAL_MARGIN, window.innerWidth - centerX)
    const BL = Math.atan2(window.innerHeight - HORIZONTAL_MARGIN - centerY, 0 - centerX)
    const BR = Math.atan2(window.innerHeight - HORIZONTAL_MARGIN - centerY, window.innerWidth - centerX)

    state.value.position = deg >= TL && deg <= TR
      ? 'top'
      : deg >= TR && deg <= BR
        ? 'right'
        : deg >= BR && deg <= BL
          ? 'bottom'
          : 'left'

    state.value.left = snapToPoints(x / window.innerWidth * 100)
    state.value.top = snapToPoints(y / window.innerHeight * 100)
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

const isHovering = ref(false)
const isVertical = computed(() => state.value.position === 'left' || state.value.position === 'right')

const anchorPos = computed(() => {
  const halfWidth = (panelEl.value?.clientWidth || 0) / 2
  const halfHeight = (panelEl.value?.clientHeight || 0) / 2

  const left = state.value.left * windowSize.width / 100
  const top = state.value.top * windowSize.height / 100

  switch (state.value.position) {
    case 'top':
      return {
        left: clamp(left, halfWidth + panelMargins.left, windowSize.width - halfWidth - panelMargins.right),
        top: panelMargins.top + halfHeight,
      }
    case 'right':
      return {
        left: windowSize.width - panelMargins.right - halfHeight,
        top: clamp(top, halfWidth + panelMargins.top, windowSize.height - halfWidth - panelMargins.bottom),
      }
    case 'left':
      return {
        left: panelMargins.left + halfHeight,
        top: clamp(top, halfWidth + panelMargins.top, windowSize.height - halfWidth - panelMargins.bottom),
      }
    case 'bottom':
    default:
      return {
        left: clamp(left, halfWidth + panelMargins.left, windowSize.width - halfWidth - panelMargins.right),
        top: windowSize.height - panelMargins.bottom - halfHeight,
      }
  }
})

let _timer: ReturnType<typeof setTimeout> | null = null
function bringUp() {
  isHovering.value = true
  if (state.value.minimizePanelInactive < 0)
    return
  if (_timer)
    clearTimeout(_timer)
  _timer = setTimeout(() => {
    isHovering.value = false
  }, +state.value.minimizePanelInactive || 0)
}

const isHidden = computed(() => {
  if (state.value.open)
    return false
  if (settings.value.ui.showPanel === true)
    return false
  if (settings.value.ui.showPanel === false)
    return true
  // If not explicitly set, show the panel
  return false
})

const isMinimized = computed(() => {
  if (state.value.minimizePanelInactive < 0)
    return false
  if (state.value.minimizePanelInactive === 0)
    return true
  // @ts-expect-error compatibility
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
  return !isDragging.value
    && !state.value.open
    && !isHovering.value
    && !isTouchDevice
    && state.value.minimizePanelInactive
})

const anchorStyle = computed(() => {
  return {
    left: `${anchorPos.value.left}px`,
    top: `${anchorPos.value.top}px`,
    pointerEvents: isHidden.value ? 'none' : 'auto',
  } as const
})

const panelStyle = computed(() => {
  const style: any = {
    transform: isVertical.value
      ? `translate(${isMinimized.value ? `calc(-50% ${state.value.position === 'right' ? '+' : '-'} 15px)` : '-50%'}, -50%) rotate(90deg)`
      : `translate(-50%, ${isMinimized.value ? `calc(-50% ${state.value.position === 'top' ? '-' : '+'} 15px)` : '-50%'})`,
  }
  if (isHidden.value) {
    style.opacity = 0
    style.pointerEvents = 'none'
  }
  if (isMinimized.value) {
    switch (state.value.position) {
      case 'top':
      case 'right':
        style.borderTopLeftRadius = '0'
        style.borderTopRightRadius = '0'
        break
      case 'bottom':
      case 'left':
        style.borderBottomLeftRadius = '0'
        style.borderBottomRightRadius = '0'
        break
    }
  }
  if (isDragging.value)
    style.transition = 'none !important'
  return style
})

const { width: frameWidth, height: frameHeight } = useElementBounding(frameBox)

const popupWindow = ref<Window | null>(null)

const iframeStyle = computed(() => {
  // eslint-disable-next-line no-sequences, ts/no-unused-expressions
  mousePosition.x, mousePosition.y

  const halfHeight = (panelEl.value?.clientHeight || 0) / 2

  const frameMargin = {
    left: panelMargins.left + halfHeight,
    top: panelMargins.top + halfHeight,
    right: panelMargins.right + halfHeight,
    bottom: panelMargins.bottom + halfHeight,
  }

  const marginHorizontal = frameMargin.left + frameMargin.right
  const marginVertical = frameMargin.top + frameMargin.bottom

  const maxWidth = windowSize.width - marginHorizontal
  const maxHeight = windowSize.height - marginVertical

  const style: CSSProperties = {
    position: 'fixed',
    zIndex: -1,
    pointerEvents: (isDragging.value || !state.value.open || props.client.inspector?.isEnabled.value) ? 'none' : 'auto',
    width: `min(${state.value.width}vw, calc(100vw - ${marginHorizontal}px))`,
    height: `min(${state.value.height}vh, calc(100vh - ${marginVertical}px))`,
  }

  const anchor = anchorPos.value
  const width = Math.min(maxWidth, state.value.width * windowSize.width / 100)
  const height = Math.min(maxHeight, state.value.height * windowSize.height / 100)

  const anchorX = anchor?.left || 0
  const anchorY = anchor?.top || 0

  switch (state.value.position) {
    case 'top':
    case 'bottom':
      style.left = `${-frameWidth.value / 2}px`
      style.transform = 'translate(0, 0)'
      if ((anchorX - frameMargin.left) < width / 2)
        style.left = `${width / 2 - anchorX + frameMargin.left - frameWidth.value / 2}px`
      else if ((windowSize.width - anchorX - frameMargin.right) < width / 2)
        style.left = `${windowSize.width - anchorX - width / 2 - frameMargin.right - frameWidth.value / 2}px`
      break
    case 'right':
    case 'left':
      style.top = `${-frameHeight.value / 2}px`
      style.transform = 'translate(0, 0)'
      if ((anchorY - frameMargin.top) < height / 2)
        style.top = `${height / 2 - anchorY + frameMargin.top - frameHeight.value / 2}px`
      else if ((windowSize.height - anchorY - frameMargin.bottom) < height / 2)
        style.top = `${windowSize.height - anchorY - height / 2 - frameMargin.bottom - frameHeight.value / 2}px`
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

  if (props.client.inspector?.isEnabled.value) {
    style.opacity = 0
  }

  return style
})

const time = computed(() => {
  let type = ''
  const metric = props.client.metrics.loading()
  let time = -1
  if (metric.pageEnd && metric.pageStart) {
    time = metric.pageEnd - metric.pageStart
    type = 'Page'
  }
  else if (metric.appLoad && metric.appInit) {
    time = metric.appLoad - metric.appInit
    type = 'App'
  }
  bringUp()
  if (time < 0)
    return [type, '', '-']
  return [type, ...millisecondToHumanreadable(time)]
})

function toggleInspector() {
  const isDevToolsOpen = state.value.open
  if (!isDevToolsOpen)
    props.client.devtools.open()

  props.client.inspector?.enable()

  if (!isDevToolsOpen) {
    setTimeout(() => {
      props.client.devtools.close()
    }, 500)
  }
}

onMounted(() => {
  bringUp()
})
</script>

<template>
  <div
    id="nuxt-devtools-anchor"
    ref="anchorEl"
    :style="[anchorStyle, vars]"
    :class="{
      'nuxt-devtools-vertical': isVertical,
      'nuxt-devtools-hide': isMinimized,
    }"
    @mousemove="bringUp"
  >
    <div
      v-if="!isSafari"
      class="nuxt-devtools-glowing"
      :style="isDragging ? 'opacity: 0.6 !important' : ''"
    />
    <div
      ref="panelEl"
      class="nuxt-devtools-panel"
      :style="panelStyle"
      @pointerdown="onPointerDown"
    >
      <button
        class="nuxt-devtools-icon-button nuxt-devtools-nuxt-button"
        title="Toggle Nuxt DevTools"
        :style="state.open ? '' : 'filter:saturate(0)'"
        @click="client.devtools.toggle()"
      >
        <svg
          viewBox="0 0 324 324" fill="none" xmlns="http://www.w3.org/2000/svg"
          style="margin-top:-1px; height: 1.2em; width: 1.2em;"
        >
          <path d="M181.767 270H302.211C306.037 270 309.795 269.003 313.108 267.107C316.421 265.211 319.172 262.484 321.084 259.2C322.996 255.915 324.002 252.19 324 248.399C323.998 244.607 322.989 240.883 321.074 237.601L240.187 98.7439C238.275 95.4607 235.525 92.7342 232.213 90.8385C228.901 88.9429 225.143 87.9449 221.318 87.9449C217.494 87.9449 213.736 88.9429 210.424 90.8385C207.112 92.7342 204.361 95.4607 202.449 98.7439L181.767 134.272L141.329 64.7975C139.416 61.5145 136.664 58.7884 133.351 56.8931C130.038 54.9978 126.28 54 122.454 54C118.629 54 114.871 54.9978 111.558 56.8931C108.245 58.7884 105.493 61.5145 103.58 64.7975L2.92554 237.601C1.01067 240.883 0.00166657 244.607 2.06272e-06 248.399C-0.00166244 252.19 1.00407 255.915 2.91605 259.2C4.82803 262.484 7.57884 265.211 10.8918 267.107C14.2047 269.003 17.963 270 21.7886 270H97.3936C127.349 270 149.44 256.959 164.641 231.517L201.546 168.172L221.313 134.272L280.637 236.1H201.546L181.767 270ZM96.1611 236.065L43.3984 236.054L122.49 100.291L161.953 168.172L135.531 213.543C125.436 230.051 113.968 236.065 96.1611 236.065Z" fill="#00DC82" />
        </svg>
      </button>
      <div
        style="border-left: 1px solid #8883;width:1px;height:10px;"
        class="nuxt-devtools-panel-content"
      />
      <div
        class="nuxt-devtools-panel-content nuxt-devtools-label"
        :title="`${time[0]} load time`"
      >
        <div class="nuxt-devtools-label-main">
          {{ time[1] }}
        </div>
        <span class="nuxt-devtools-label-secondary">
          {{ time[2] }}
        </span>
      </div>
      <template v-if="client.inspector?.isAvailable">
        <div
          style="border-left: 1px solid #8883;width:1px;height:10px;"
          class="nuxt-devtools-panel-content"
        />
        <button class="nuxt-devtools-icon-button nuxt-devtools-panel-content" title="Toggle Component Inspector" @click.prevent.stop="toggleInspector">
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

    <div
      ref="frameBox"
      :style="iframeStyle"
    >
      <FrameBox
        v-model:popup-window="popupWindow"
        :state
        :client="client"
        :is-dragging="isDragging"
      />
    </div>
  </div>
</template>
