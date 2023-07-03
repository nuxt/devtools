<script setup lang="ts">
import type { FunctionMetricCallRecord } from '../../types'

const props = defineProps<{
  item: FunctionMetricCallRecord
  width: number
}>()

const colorRaw = computed(() => getHashColorFromString(props.item.name, 50, 60, '_op_'))
const color = computed(() => colorRaw.value.replace(/_op_/, '1'))
const textColor = computed(() => getHashColorFromString(props.item.name, 50, 40))
const colorBackground = computed(() => colorRaw.value.replace(/_op_/, '0.1'))
</script>

<template>
  <button relative hover:z-1000 bg-base class="group">
    <div
      :style="{
        backgroundColor: colorBackground,
        borderLeft: `2px solid ${color}`,
        width: `${props.width}px`,
      }"
      absolute bottom-0 left--1px top-0 px1 text-sm
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
