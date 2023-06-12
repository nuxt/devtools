<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { state, togglePanel } from './state'
import { useEventListener } from './utils'

// TODO: persist position
const el = ref<HTMLDivElement>()
const windowSize = ref({ width: 0, height: 0 })
const isDragging = ref(false)
const draggingOffset = ref({ x: 0, y: 0 })

function onPointerDown(e: PointerEvent) {
  isDragging.value = true
  draggingOffset.value = {
    x: e.clientX - el.value!.offsetLeft,
    y: e.clientY - el.value!.offsetTop,
  }
}

onMounted(() => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
  useEventListener(window, 'resize', () => {
    windowSize.value = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  })
  useEventListener(window, 'pointermove', (e: PointerEvent) => {
    if (!isDragging.value)
      return

    const centerX = windowSize.value.width / 2
    const centerY = windowSize.value.height / 2

    const x = e.clientX - draggingOffset.value.x
    const y = e.clientY - draggingOffset.value.y

    state.value.floatingPanelDegPosition = Math.atan2(y - centerY, x - centerX)
  })
  useEventListener(window, 'pointerup', () => {
    isDragging.value = false
  })
  useEventListener(window, 'pointerleave', () => {
    isDragging.value = false
  })
})

/**
 * Determine which area the floating widget is in
 */
const area = computed(() => {
  const centerX = windowSize.value.width / 2
  const centerY = windowSize.value.height / 2

  /**
   *   T
   * L   R
   *   B
   */
  const HORIZONTAL_MARGIN = 80
  const TL = Math.atan2(0 - centerY + HORIZONTAL_MARGIN, 0 - centerX)
  const TR = Math.atan2(0 - centerY + HORIZONTAL_MARGIN, windowSize.value.width - centerX)
  const BL = Math.atan2(windowSize.value.height - HORIZONTAL_MARGIN - centerY, 0 - centerX)
  const BR = Math.atan2(windowSize.value.height - HORIZONTAL_MARGIN - centerY, windowSize.value.width - centerX)

  const deg = state.value.floatingPanelDegPosition
  if (deg >= TL && deg <= TR)
    return 'T'
  if (deg >= TR && deg <= BR)
    return 'R'
  if (deg >= BR && deg <= BL)
    return 'B'
  return 'L'
})

const isVertical = computed(() => {
  return area.value === 'L' || area.value === 'R'
})

const MARGIN = 10

const style = computed(() => {
  const midX = windowSize.value.width / 2
  const midY = windowSize.value.height / 2

  let left = 0
  let top = 0

  const halfWidth = (el.value?.clientWidth || 0) / 2
  const halfHeight = (el.value?.clientHeight || 0) / 2
  const deg = state.value.floatingPanelDegPosition

  switch (area.value) {
    case 'T':
      left = Math.cos(deg) * midX * 1.5 + midX
      left = Math.max(MARGIN + halfWidth, Math.min(left, windowSize.value.width - MARGIN - halfWidth))
      top = MARGIN + halfHeight
      break
    case 'R':
      left = windowSize.value.width - MARGIN - halfHeight
      top = Math.sin(deg) * midY + midY
      top = Math.max(MARGIN + halfHeight, Math.min(top, windowSize.value.height - MARGIN - halfHeight))
      break
    case 'L':
      left = MARGIN + halfHeight
      top = Math.sin(deg) * midY + midY
      top = Math.max(MARGIN + halfHeight, Math.min(top, windowSize.value.height - MARGIN - halfHeight))
      break
    case 'B':
    default:
      left = Math.cos(deg) * midX * 1.5 + midX
      left = Math.max(MARGIN + halfWidth, Math.min(left, windowSize.value.width - MARGIN - halfWidth))
      top = windowSize.value.height - MARGIN - halfHeight
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
  }
})
</script>

<template>
  <div
    ref="el"
    class="nuxt-devtools-floating"
    :style="style"
    :class="{ vertical: isVertical }"
    @pointerdown="onPointerDown"
  >
    <div class="glowing" :style="isDragging ? 'opacity: 0 !important' : ''" />
    <button class="panel">
      <button class="icon-button nuxt-button" @click="togglePanel">
        <svg viewBox="0 0 324 324" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-top:-1px; height: 1.2em; width: 1.2em;">
          <path d="M181.767 270H302.211C306.037 270 309.795 269.003 313.108 267.107C316.421 265.211 319.172 262.484 321.084 259.2C322.996 255.915 324.002 252.19 324 248.399C323.998 244.607 322.989 240.883 321.074 237.601L240.187 98.7439C238.275 95.4607 235.525 92.7342 232.213 90.8385C228.901 88.9429 225.143 87.9449 221.318 87.9449C217.494 87.9449 213.736 88.9429 210.424 90.8385C207.112 92.7342 204.361 95.4607 202.449 98.7439L181.767 134.272L141.329 64.7975C139.416 61.5145 136.664 58.7884 133.351 56.8931C130.038 54.9978 126.28 54 122.454 54C118.629 54 114.871 54.9978 111.558 56.8931C108.245 58.7884 105.493 61.5145 103.58 64.7975L2.92554 237.601C1.01067 240.883 0.00166657 244.607 2.06272e-06 248.399C-0.00166244 252.19 1.00407 255.915 2.91605 259.2C4.82803 262.484 7.57884 265.211 10.8918 267.107C14.2047 269.003 17.963 270 21.7886 270H97.3936C127.349 270 149.44 256.959 164.641 231.517L201.546 168.172L221.313 134.272L280.637 236.1H201.546L181.767 270ZM96.1611 236.065L43.3984 236.054L122.49 100.291L161.953 168.172L135.531 213.543C125.436 230.051 113.968 236.065 96.1611 236.065Z" fill="#00DC82" />
        </svg>
      </button>
      <div style="border-left: 1px solid #8883;width:1px;height:10px;margin-right:8px" />
      <div class="label">
        42
        <!-- TODO: read from page load time -->
      </div>
      <span class="unit">ms</span>
      <div style="border-left: 1px solid #8883;width:1px;height:10px;margin-left:8px" />
      <button class="icon-button">
        <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.2em; width: 1.2em; opacity:0.8;" viewBox="0 0 24 24"><path fill="currentColor" d="m13 1l.001 3.062A8.004 8.004 0 0 1 19.938 11H23v2l-3.062.001a8.004 8.004 0 0 1-6.937 6.937L13 23h-2v-3.062a8.004 8.004 0 0 1-6.938-6.937L1 13v-2h3.062A8.004 8.004 0 0 1 11 4.062V1h2Zm-1 5a6 6 0 1 0 0 12a6 6 0 0 0 0-12Zm0 4a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z" /></svg>
      </button>
    </button>
  </div>
</template>

<style scoped>
.nuxt-devtools-floating {
  z-index: 2147483645;
  position: fixed;
  transform-origin: center center;
  transform: translate(-50%, -50%) rotate(0);
}

.nuxt-devtools-floating .label {
  font-size: 0.8em;
  line-height: 1em;
}

.nuxt-devtools-floating .unit {
  font-size: 0.7em;
  line-height: 0.6em;
  opacity: 0.5;
}
.nuxt-devtools-floating.vertical {
  transform: translate(-50%, -50%) rotate(90deg);
}

.nuxt-devtools-floating.vertical .nuxt-button,
.nuxt-devtools-floating.vertical .label,
.nuxt-devtools-floating.vertical .unit {
  transform: rotate(-90deg);
}

.nuxt-devtools-floating .panel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  padding: 2px 4px;
  border: 1px solid var(--nuxt-devtools-widget-border);
  border-radius: 100px;
  background-color: var(--nuxt-devtools-widget-bg);
  backdrop-filter: blur(10px);
  color: var(--nuxt-devtools-widget-fg);
  box-shadow: 2px 2px 8px var(--nuxt-devtools-widget-shadow);
  transition: all 0.2s ease;
}

.nuxt-devtools-floating.vertical .panel {
  box-shadow: 2px -2px 8px var(--nuxt-devtools-widget-shadow);
}

.nuxt-devtools-floating .icon-button {
  border-radius: 100%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
}
.nuxt-devtools-floating .icon-button:hover {
  opacity: 1;
}

.nuxt-devtools-floating:hover .glowing {
  opacity: 0.6;
}

.nuxt-devtools-floating .glowing {
  position: absolute;
  left: 50%;
  top: 30px;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  opacity: 0;
  transition: all 0.8s ease;
  pointer-events: none;
  z-index: -1;
  border-radius: 9999px;
  background-image: linear-gradient(-45deg,#00dc82,#36e4da,#0047e1);
  filter: blur(60px);
}
</style>
