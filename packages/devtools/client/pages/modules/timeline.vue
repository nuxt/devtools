<script setup lang="ts">
import type { TimelineEvent, TimelineEventNormalized } from '../../../types'

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

const selected = ref<TimelineEventNormalized<TimelineEvent> | undefined>()

const metrics = computed(() => client.value?.clientTimelineMetrics)

function clear() {
  if (metrics.value)
    metrics.value.events = []
}
</script>

<template>
  <div v-if="metrics" h-screen of-hidden>
    <TimelineTable :data="{ ...metrics }" @select="s => selected = s">
      <div h-10 flex="~ gap-2 items-center justify-end" p2>
        <NCheckbox
          v-model="metrics.options.enabled"
          label="Enabled"
          class="text-sm"
        >
          Enable Tracking
        </NCheckbox>
        <div flex-auto />
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
      <div min-h-50 px3 py2>
        <TimelineDetailsFunction v-if="selected?.event.type === 'function'" :record="selected.event" />
        <TimelineDetailsRoute v-else-if="selected?.event.type === 'route'" :record="selected.event" />
      </div>
    </DrawerBottom>
  </div>
</template>
