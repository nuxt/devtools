<script setup lang="ts">
import { computed } from 'vue'
import { useVModel } from '@vueuse/core'

const props = withDefaults(defineProps<{
  modelValue: number
  total: number
  pageCount?: number
  max?: number
  divider?: string
}>(), {
  pageCount: 5,
  divider: '...',
  max: 10,
})

const emit = defineEmits<{ (...args: any): void }>()
const currentPage = useVModel(props, 'modelValue', emit, { passive: true })

const pages = computed(() => Array.from({ length: Math.ceil(props.total / props.pageCount) }, (_, i) => i + 1))

const displayedPages = computed(() => {
  if (!props.max || pages.value.length <= 5) {
    return pages.value
  }
  else {
    const current = currentPage.value
    const max = pages.value.length
    const r = Math.floor((Math.min(props.max, max) - 5) / 2)
    const r1 = current - r
    const r2 = current + r
    const beforeWrapped = r1 - 1 > 1
    const afterWrapped = r2 + 1 < max
    const items: Array<number | string> = [1]

    if (beforeWrapped)
      items.push(props.divider)

    if (!afterWrapped) {
      const addedItems = (current + r + 2) - max
      for (let i = current - r - addedItems; i <= current - r - 1; i++)
        items.push(i)
    }

    for (let i = r1 > 2 ? (r1) : 2; i <= Math.min(max, r2); i++)
      items.push(i)

    if (!beforeWrapped) {
      const addedItems = 1 - (current - r - 2)
      for (let i = current + r + 1; i <= current + r + addedItems; i++)
        items.push(i)
    }

    if (afterWrapped)
      items.push(props.divider)

    if (r2 < max)
      items.push(max)

    // Replace divider by number on start edge case [1, '…', 3, ...]
    if (items.length >= 3 && items[1] === props.divider && items[2] === 3)
      items[1] = 2

    // Replace divider by number on end edge case [..., 48, '…', 50]
    if (items.length >= 3 && items[items.length - 2] === props.divider && items[items.length - 1] === items.length)
      items[items.length - 2] = items.length - 1

    return items
  }
})

const hasPrev = computed(() => currentPage.value > 1)
const hasNext = computed(() => currentPage.value < pages.value.length)

function clickNext() {
  if (!hasNext.value)
    return
  currentPage.value++
}
function clickPrev() {
  if (!hasPrev.value)
    return
  currentPage.value--
}
</script>

<template>
  <div flex="~ ">
    <slot name="prev" @click="clickPrev">
      <NButton rounded="l none" icon="carbon-chevron-left" @click="clickPrev" />
    </slot>

    <NButton
      v-for="(page, index) of displayedPages"
      :key="`${page}-${index}`"
      rounded-none
      :class="[
        { 'pointer-events-none': typeof page === 'string' },
        { 'border-primary text-primary': page === currentPage },
      ]"
      :n="page === currentPage ? 'primary' : ''"
      @click="currentPage = page as number"
      v-text="page"
    />

    <slot name="next" @click="clickNext">
      <NButton rounded="r none" icon="carbon-chevron-right" @click="clickNext" />
    </slot>
  </div>
</template>
