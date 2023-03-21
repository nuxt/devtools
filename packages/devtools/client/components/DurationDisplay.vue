<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    duration: number | undefined
    factor?: number
  }>(),
  { factor: 1 },
)

function getLatencyColor(latency: number | undefined) {
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

function formatDuration(duration: number | undefined) {
  if (!duration)
    return '-'
  if (duration < 1)
    return '<1'
  return duration.toFixed(2)
}
</script>

<template>
  <div :class="getLatencyColor(duration)">
    {{ formatDuration(duration) }}<span op50 text-xs ml-1>ms</span>
  </div>
</template>
