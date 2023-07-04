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

function clear() {
  const metrics = client.value?.clientTimelineMetrics
  if (metrics) {
    metrics.functions = []
    metrics.routes = []
  }
}
</script>

<template>
  <div h-screen of-hidden>
    <TimelineTable :data="{ ...client?.clientTimelineMetrics }" @select="s => selected = s">
      <div h-10 flex="~ gap-2 items-center justify-end" p2>
        <NIconButton
          icon="i-carbon-trash-can"
          hover-text-red
          class="ml-2"
          @click="clear"
        />
      </div>
    </TimelineTable>
    <DrawerBottom
      :model-value="!!selected"
      auto-close
      @close="selected = undefined"
    >
      <FunctionMetricDetails v-if="selected" :record="selected" />
    </DrawerBottom>
  </div>
</template>
