<script setup lang="ts">
import type { FunctionMetricCallRecord } from '../../types'

const props = defineProps<{
  record: FunctionMetricCallRecord
}>()

const timeAgo = useTimeAgo(() => props.record.start)
</script>

<template>
  <div v-if="record" p-4>
    <div font-mono>
      <span>{{ record.name }}</span>
      <span text-amber-2> ({{ record.args?.map(i => typeof i === 'symbol' ? '<ref>' : JSON.stringify(i)).join(', ') }})</span>
    </div>

    <DurationDisplay
      v-if="record.end"
      :duration="record.end - record.start"
    />

    <div class="text-xs text-gray-400">
      {{ timeAgo }}
    </div>
  </div>
</template>
