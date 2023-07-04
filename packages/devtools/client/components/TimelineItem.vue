<script setup lang="ts">
import type { TimelineFunctionRecord } from '../../types'

const props = defineProps<{
  item: TimelineFunctionRecord
  width: number
}>()

const colorRaw = computed(() => getHashColorFromString(props.item.name, 50, 60, '_op_'))
const color = computed(() => colorRaw.value.replace(/_op_/, '1'))
const textColor = computed(() => getHashColorFromString(props.item.name, 50, 40))
const colorBackground = computed(() => colorRaw.value.replace(/_op_/, '0.1'))
</script>

<template>
  <button
    class="group"
    :style="{
      color,
      borderLeft: `2px solid ${color}`,
    }"
    relative border-2 border-transparent transition hover:z-1000 hover:border-current bg-base
  >
    <div
      :style="{
        backgroundColor: colorBackground,
        width: `${props.width}px`,
      }"
      absolute bottom-0 left--1px top-0 text-sm transition-all duration-300
      class="group-hover-w-full!"
    />
    <div
      :style="{
        color: textColor,
      }" px1
    >
      {{ item.name }}
    </div>
  </button>
</template>
