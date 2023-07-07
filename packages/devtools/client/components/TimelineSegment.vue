<script setup lang="ts">
import type { TimelineEventFunction, TimelineEventsSegment } from '../../types'

const props = defineProps<{
  segment: TimelineEventsSegment
}>()

const emit = defineEmits<{
  (event: 'select', record: TimelineEventFunction): void
}>()

const timeAgo = useTimeAgo(() => props.segment.start, {
  showSecond: true,
})
</script>

<template>
  <div relative h-full>
    <div absolute left-1 top-3 text-xs op50>
      {{ timeAgo }}
    </div>
    <TimelineItemFunction
      v-for="i, idx of segment.functions"
      :key="idx"
      :item="i.event"
      :style="{
        width: `${i.relativeWidth * 100}%`,
        position: 'absolute',
        top: `${4 + i.layer * 1.6}em`,
        left: `${i.relativeStart * 100}%`,
      }"
      @click="emit('select', i.event)"
    />
    <template v-for="i in segment.routes" :key="i">
      <div
        absolute top-0 h-full w-px border-l border-green6 border-dashed op50
        :style="{
          left: `${i.relativeStart * 100}%`,
        }"
      />
      <div
        absolute mt8 text-xs font-mono text-green6 bg-base border="l green6"
        :style="{
          left: `${i.relativeStart * 100}%`,
        }"
      >
        <div bg-green6:10 px1 py0.5>
          {{ i.event.to }}
        </div>
      </div>
    </template>
  </div>
</template>
