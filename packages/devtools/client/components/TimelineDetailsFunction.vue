<script setup lang="ts">
import type { TimelineEventFunction } from '../../types'
import { useTimeAgo } from '@vueuse/core'
import { computed } from 'vue'
import { useAutoImports } from '~/composables/state'

const props = defineProps<{
  record: TimelineEventFunction
}>()

const timeAgo = useTimeAgo(() => props.record.start, { showSecond: true })

const autoImports = useAutoImports()
const importsMetadata = computed(() => autoImports.value?.metadata)
const importItem = computed(() => {
  return autoImports.value?.imports.find(i => i.as === props.record.name)
})
</script>

<template>
  <div v-if="record" p-4 flex="~ col gap-2" text-base>
    <div mx--1>
      <NBadge n="yellow" v-text="'Function call'" />
    </div>
    <div flex="~ gap-1" font-mono>
      <ComposableItem
        v-if="importItem"
        :item="importItem"
        :metadata="importsMetadata"
        :counter="false"
        classes="px2 py1"
        mx--2
      />
      <span v-else>{{ record.name }}</span>
      <span ml1 op30>(</span>
      <template v-for="arg, idx in record.args" :key="idx">
        <span v-if="idx" op30>, </span>
        <TimelineArgumentView :value="arg" />
      </template>
      <span op30>)</span>
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

    <StacktraceList
      v-if="record.stacktrace" :stacktrace="record.stacktrace"
      class="text-xs text-gray-400"
    />
  </div>
</template>
