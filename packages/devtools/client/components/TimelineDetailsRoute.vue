<script setup lang="ts">
import type { TimelineEventRoute } from '../../types'

const props = defineProps<{
  record: TimelineEventRoute
}>()

const timeAgo = useTimeAgo(() => props.record.start, { showSecond: true })
</script>

<template>
  <div v-if="record" p-4 flex="~ col gap-2">
    <div mx--1>
      <NBadge n="green" v-text="'Route Change'" />
    </div>
    <div flex="~ gap-1 items-center" font-mono>
      <span op50>{{ record.from }}</span>
      <span i-carbon-arrow-right op50 />
      <span>{{ record.to }}</span>
    </div>

    <div flex="~ gap-1" text-sm>
      <DurationDisplay
        v-if="record.end"
        :duration="record.end - record.start"
      />
      <span mx1 op50>·</span>
      <div class="text-sm text-gray-400">
        {{ timeAgo }}
      </div>
    </div>
  </div>
</template>
