<script setup lang="ts">
import type { UseTimeAgoOptions } from '@vueuse/core'
import type { TimelineEvent, TimelineEventNormalized, TimelineEventsSegment } from '../../types'

const props = defineProps<{
  segment: TimelineEventsSegment
}>()

const emit = defineEmits<{
  (event: 'select', record: TimelineEventNormalized<TimelineEvent>): void
}>()

const timeAgo = useTimeAgo(() => props.segment.start, {
  updateInterval: 1000,
  showSecond: true,
  controls: false,
  messages: ({
    justNow: '',
    past: s => s,
    future: s => s,
    invalid: '-',
    second: s => s ? `${s}s` : '',
    minute: m => `${m}m`,
    hour: h => `${h}h`,
    week: w => `${w}w`,
    day: d => `${d}d`,
    month: m => `${m}mo`,
    year: y => `${y}y`,
  } satisfies UseTimeAgoOptions<false>['messages']) as any,
})
</script>

<template>
  <div relative h-full>
    <button
      absolute left-0 right-0 top-0 bg-green:5 px2 py1 text-left text-xs text-green6 font-mono
      @click="segment.route ? emit('select', segment.route) : undefined"
    >
      {{ segment.route?.event.to }}
    </button>
    <div absolute left-2 top-2.3em text-xs op50>
      {{ timeAgo }} ago
    </div>
    <div>
      <TimelineItemFunction
        v-for="i, idx of segment.functions"
        :key="idx"
        :item="i.event"
        :style="{
          position: 'absolute',
          minWidth: `${i.relativeWidth * 100}%`,
          maxWidth: `${i.relativeWidth * 100}%`,
          top: `${4 + i.layer * 1.6}em`,
          left: `${i.relativeStart * 100}%`,
        }"
        @click="emit('select', i)"
      />
    </div>
  </div>
</template>
