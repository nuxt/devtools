<script setup lang="ts">
import type { NuxtCopilotProps } from './Props'
import { onClickOutside, useDraggable } from '@vueuse/core'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'

const { props } = defineProps<{ props: NuxtCopilotProps }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'selectParent'): void
  (e: 'openInEditor', file: string): void
}>()

const PANEL_WIDTH = 400
const PANEL_HEIGHT = 300
const PANEL_MARGIN = 30

const initX = ref(0)
const initY = ref(0)

watch(
  () => [props.matched, props.mouse] as const,
  ([matched, mouse]) => {
    if (!matched || !mouse)
      return
    initX.value = Math.max(PANEL_MARGIN, Math.min(mouse.x, window.innerWidth - PANEL_WIDTH - PANEL_MARGIN))
    initY.value = Math.max(PANEL_MARGIN, Math.min(mouse.y, window.innerHeight - PANEL_HEIGHT - PANEL_MARGIN))
  },
)

const el = useTemplateRef<HTMLElement>('el')
const draggingEl = useTemplateRef<HTMLElement>('draggingEl')
const isMounted = ref(false)

const { x, y, style, isDragging } = useDraggable(el, {
  initialValue: {
    x: initX.value,
    y: initY.value,
  },
  handle: draggingEl,
})

watch([initX, initY], () => {
  if (!isMounted.value)
    return
  x.value = initX.value
  y.value = initY.value
})

const hasMoved = computed(() => x.value !== initX.value || y.value !== initY.value)

onClickOutside(el, () => {
  if (!isMounted.value)
    return
  if (hasMoved.value)
    return
  close()
})

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 1000)
})

function close() {
  emit('close')
}

async function selectParent() {
  emit('selectParent')
}

async function openInEditor() {
  if (!props.matched)
    return
  const file = `${props.matched.pos[0]}:${props.matched.pos[1]}:${props.matched.pos[2]}`
  // await fetch(`/api/open-in-editor?file=${encodeURI(file)}`)
  emit('openInEditor', file)
  close()
}
</script>

<template>
  <div
    ref="el"
    class="bg-glass ring-base fixed relative z-9999999 w-400px flex flex-col of-hidden rounded-lg text-sm shadow-lg ring-1 backdrop-blur duration-200"
    :style="style"
    :class="[
      isDragging ? 'transition-none' : 'transition-opacity',
      props.matched ? 'op100' : 'op0 pointer-events-none',
    ]"
  >
    <div
      class="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
    >
      <div class="nuxt-devtools-inspect-running-border pointer-events-none absolute inset-0 z-10 border-1.5 border-transparent rounded-lg" />
    </div>
    <div ref="draggingEl" class="flex items-center gap-2 p3">
      <button
        title="Go to parent"
        class="flex items-center text-sm font-mono op50 hover:text-green6 hover:op100"
        @click="selectParent"
      >
        <div class="i-ph-arrow-bend-left-up-duotone text-lg" />
      </button>
      <button
        title="Open in editor"
        class="flex items-center text-sm font-mono op50 hover:text-green6 hover:op100"
        @click="openInEditor"
      >
        <span v-if="props.matched">{{ props.matched.pos[0] }}:{{ props.matched.pos[1] }}:{{ props.matched.pos[2] }}</span>
        <div class="i-ph-arrow-up-right-light mt--2 text-lg" />
      </button>
      <div class="flex-auto" />
      <button
        title="Close"
        class="flex-none op50 hover:op100"
        @click="close"
      >
        <div class="i-ph-x text-lg" />
      </button>
    </div>
  </div>
</template>
