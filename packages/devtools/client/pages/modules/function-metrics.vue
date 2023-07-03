<script setup lang="ts">
import type { FunctionMetricCallRecord } from '../../../types'

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

const selected = ref<FunctionMetricCallRecord | undefined>()
</script>

<template>
  <div h-screen of-hidden>
    <TimelineTable :records="metrics" @select="s => selected = s" />
    <DrawerBottom
      :model-value="!!selected"
      auto-close
      @close="selected = undefined"
    >
      <FunctionMetricDetails v-if="selected" :record="selected" />
    </DrawerBottom>
  </div>
</template>
