<script setup lang="ts">
import type { TimelineFunctionRecord } from '../../../types'

definePageMeta({
  icon: 'i-carbon-roadmap',
  title: 'Timeline',
  category: 'analyze',
  show() {
    const client = useClient()
    return () => client.value?.clientTimelineMetrics
  },
})

const client = useClient()

const selected = ref<TimelineFunctionRecord | undefined>()
</script>

<template>
  <div h-screen of-hidden>
    <TimelineTable :data="{ ...client?.clientTimelineMetrics }" @select="s => selected = s" />
    <DrawerBottom
      :model-value="!!selected"
      auto-close
      @close="selected = undefined"
    >
      <FunctionMetricDetails v-if="selected" :record="selected" />
    </DrawerBottom>
  </div>
</template>
