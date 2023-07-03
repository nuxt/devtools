<script setup lang="ts">
definePageMeta({
  icon: 'i-carbon-roadmap',
  title: 'Function Metrics',
  category: 'analyze',
  show() {
    const client = useClient()
    return () => client.value?.clientFunctionMetrics
  },
})

const client = useClient()
const metrics = computed(() => [...client.value?.clientFunctionMetrics?.records || []])
</script>

<template>
  <div>
    <TimelineTable :records="metrics" />
  </div>
</template>
