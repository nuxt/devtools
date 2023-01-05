<script setup lang="ts">
import type { HookInfo } from '~/../src/types'

const props = defineProps<{
  hooks: HookInfo[]
}>()

type SortBy = 'duration' | 'name' | 'listener' | 'start'

let sortby = $ref<SortBy>('duration')
let direction = $ref<'asc' | 'desc'>('asc')

const sortFunctions = {
  duration: (a: HookInfo, b: HookInfo) => (b.duration ?? Infinity) - (a.duration ?? Infinity),
  name: (a: HookInfo, b: HookInfo) => a.name.localeCompare(b.name),
  listener: (a: HookInfo, b: HookInfo) => b.listeners - a.listeners,
  start: (a: HookInfo, b: HookInfo) => b.start - a.start,
}

const sorted = $computed(() => {
  const sortFn = sortFunctions[sortby as SortBy]
  const sorted = [...props.hooks].sort(sortFn)
  if (direction === 'desc')
    sorted.reverse()
  return sorted
})

function formatDuration(duration: number | undefined) {
  if (!duration)
    return '-'
  return duration.toFixed(2)
}

function getNamePrefix(name: string) {
  const parts = name.split(':')
  if (parts.length === 1)
    return ''
  return `${parts[0]}:`
}

function getNameRest(name: string) {
  const parts = name.split(':')
  if (parts.length === 1)
    return name
  return parts.slice(1).join(':')
}

function getLatencyColor(latency: number | undefined) {
  if (!latency)
    return 'text-gray-400'
  if (latency > 1000)
    return 'text-red-400'
  if (latency > 500)
    return 'text-orange-400'
  if (latency > 200)
    return 'text-yellow-400'
  return ''
}

function getHashColorFromString(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const h = hash % 360
  return `hsl(${h}, 65%, 50%)`
}

function toggleSortedBy(by: SortBy) {
  if (sortby === by)
    direction = direction === 'asc' ? 'desc' : 'asc'
  else
    sortby = by
}
</script>

<template>
  <table w-full mt5>
    <thead border="b base">
      <tr>
        <th colspan="2" p1 text-center font-bold>
          <button @click="toggleSortedBy('name')">
            Hook Name
            <div text-xs :class="[sortby === 'name' ? 'op50' : 'op0', direction === 'asc' ? 'carbon-arrow-down' : 'carbon-arrow-up']" />
          </button>
        </th>
        <th p1 text-center font-bold>
          <button @click="toggleSortedBy('listener')">
            Listeners
            <div text-xs :class="[sortby === 'listener' ? 'op50' : 'op0', direction === 'asc' ? 'carbon-arrow-down' : 'carbon-arrow-up']" />
          </button>
        </th>
        <th p1 text-right font-bold>
          <button @click="toggleSortedBy('start')">
            Start At
            <div text-xs :class="[sortby === 'start' ? 'op50' : 'op0', direction === 'asc' ? 'carbon-arrow-down' : 'carbon-arrow-up']" />
          </button>
        </th>
        <th p1 text-right font-bold>
          <button @click="toggleSortedBy('duration')">
            Duration
            <div text-xs :class="[sortby === 'duration' ? 'op50' : 'op0', direction === 'asc' ? 'carbon-arrow-down' : 'carbon-arrow-up']" />
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of sorted" :key="item.name">
        <td text-right w-0 ws-nowrap :style="{ color: getHashColorFromString(getNamePrefix(item.name)) }">
          <code text-sm>{{ getNamePrefix(item.name) }}</code>
        </td>
        <td w-0 ws-nowrap>
          <code text-sm>{{ getNameRest(item.name) }}</code>
        </td>
        <td text-center>
          <code text-sm>{{ item.listeners }}</code>
        </td>
        <td text-right>
          <code text-sm>{{ Math.round(item.start) }}</code>
        </td>
        <td text-right text-sm :class="getLatencyColor(item.duration)">
          {{ formatDuration(item.duration) }}<span op50 ml-1 text-xs>ms</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
