<script setup lang="ts">
import type { FunctionMetricCallRecord } from '../../types'

const props = defineProps<{
  item: FunctionMetricCallRecord
}>()

const colorRaw = computed(() => getHashColorFromString(props.item.name, 50, 50, '_op_'))
const color = computed(() => colorRaw.value.replace(/_op_/, '1'))
const colorBackground = computed(() => colorRaw.value.replace(/_op_/, '0.15'))
</script>

<template>
  <div
    :style="{
      backgroundColor: colorBackground,
      borderLeft: `2px solid ${color}`,
      borderBottom: `1px solid ${color}`,
      color,
    }"
    px1 text-sm
    hover:z-1000
  >
    {{ item.name }}
  </div>
</template>
