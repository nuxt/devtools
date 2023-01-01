<script setup lang="ts">
import type { HookInfo } from '~/../src/types'

const props = defineProps<{
  hooks: HookInfo[]
}>()

type SortBy = 'duration' | 'name'

let sortby = $ref<SortBy>('duration')
const sorted = $computed(() => {
  const sortFn = sortby === 'duration'
    ? (a: HookInfo, b: HookInfo) => (b.duration ?? Infinity) - (a.duration ?? Infinity)
    : (a: HookInfo, b: HookInfo) => a.name.localeCompare(b.name)
  return [...props.hooks].sort(sortFn)
})

function formatDuration(duration: number | undefined) {
  if (duration == null)
    return '-'
  if (duration > 1000)
    return `${(duration / 1000).toFixed(2)}s`
  if (duration < 1)
    return `${Math.round(duration * 1000)}μs`
  return `${duration.toFixed(2)}ms`
}

function toggleSortBy() {
  sortby = sortby === 'duration'
    ? 'name'
    : 'duration'
}
</script>

<template>
  <div>
    Sort by
    <NButton n-xs @click="toggleSortBy()">
      {{ sortby }}
    </NButton>
  </div>
  <table w-full mt5>
    <thead border="b base">
      <tr>
        <th p1 text-left font-bold>
          Hook Name
        </th>
        <th p1 text-right font-bold>
          Duration
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of sorted" :key="item.name">
        <td p1>
          <code>{{ item.name }}</code>
        </td>
        <td text-right>
          <code>{{ formatDuration(item.duration) }}</code>
        </td>
      </tr>
    </tbody>
  </table>
</template>
