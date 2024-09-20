<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    duration: number | undefined
    factor?: number
    color?: boolean
  }>(),
  {
    factor: 1,
    color: true,
  },
)

function getLatencyColor(latency: number | undefined) {
  if (!props.color)
    return ''
  if (!latency)
    return 'text-gray-400'
  latency = latency * props.factor
  if (latency < 0.5)
    return 'text-gray:50'
  if (latency > 1000)
    return 'text-red-400'
  if (latency > 500)
    return 'text-orange-400'
  if (latency > 200)
    return 'text-yellow-400'
  return ''
}

const units = computed(() => {
  if (!props.duration || props.duration < 1)
    return ['<1', 'ms']
  if (props.duration < 1000)
    return [props.duration.toFixed(0), 'ms']
  if (props.duration < 1000 * 60)
    return [(props.duration / 1000).toFixed(1), 's']
  return [(props.duration / 1000 / 60).toFixed(1), 'min']
})
</script>

<template>
  <div :class="getLatencyColor(duration)">
    {{ units[0] }}<span ml-1 text-xs op50>{{ units[1] }}</span>
  </div>
</template>
