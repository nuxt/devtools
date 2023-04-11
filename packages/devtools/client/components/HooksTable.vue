<script setup lang="ts">
import type { HookInfo } from '~/../src/types'

const props = defineProps<{
  hooks: HookInfo[]
}>()

type SortBy = 'duration' | 'name' | 'listener' | 'start' | 'executions'

const sortby = ref<SortBy>('duration')
const direction = ref<'asc' | 'desc'>('asc')

const sortFunctions = {
  duration: (a: HookInfo, b: HookInfo) => (b.duration ?? Infinity) - (a.duration ?? Infinity),
  name: (a: HookInfo, b: HookInfo) => a.name.localeCompare(b.name),
  listener: (a: HookInfo, b: HookInfo) => b.listeners - a.listeners,
  start: (a: HookInfo, b: HookInfo) => b.start - a.start,
  executions: (a: HookInfo, b: HookInfo) => b.executions.length - a.executions.length,
}

const startTimes = computed(() => props.hooks.map(i => i.start).sort((a, b) => a - b))

const sorted = computed(() => {
  const sortFn = sortFunctions[sortby.value]
  const sorted = [...props.hooks].sort(sortFn)
  if (direction.value === 'desc')
    sorted.reverse()
  return sorted
})

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

function getHashColorFromString(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const h = hash % 360
  return `hsl(${h}, 65%, 50%)`
}

function toggleSortedBy(by: SortBy) {
  if (sortby.value === by)
    direction.value = direction.value === 'asc' ? 'desc' : 'asc'
  else
    sortby.value = by
}
</script>

<template>
  <table w-full>
    <thead border="b base">
      <tr>
        <th select-none ws-nowrap p1 text-right font-bold>
          <button @click="toggleSortedBy('start')">
            Order
            <div ml--1 text-xs :class="[sortby === 'start' ? 'op50' : 'op0', direction === 'asc' ? 'carbon-arrow-down' : 'carbon-arrow-up']" />
          </button>
        </th>
        <th colspan="2" p1 pl5 text-left font-bold>
          <button @click="toggleSortedBy('name')">
            Hook name
            <div ml--1 text-xs :class="[sortby === 'name' ? 'op50' : 'op0', direction === 'asc' ? 'carbon-arrow-down' : 'carbon-arrow-up']" />
          </button>
        </th>
        <th ws-nowrap p1 text-center font-bold>
          <button @click="toggleSortedBy('listener')">
            Listeners
            <div ml--1 text-xs :class="[sortby === 'listener' ? 'op50' : 'op0', direction === 'asc' ? 'carbon-arrow-down' : 'carbon-arrow-up']" />
          </button>
        </th>
        <th ws-nowrap p1 text-center font-bold>
          <button @click="toggleSortedBy('executions')">
            Executions
            <div ml--1 text-xs :class="[sortby === 'executions' ? 'op50' : 'op0', direction === 'asc' ? 'carbon-arrow-down' : 'carbon-arrow-up']" />
          </button>
        </th>
        <th ws-nowrap p1 text-right font-bold>
          <button @click="toggleSortedBy('duration')">
            Duration
            <div ml--1 text-xs :class="[sortby === 'duration' ? 'op50' : 'op0', direction === 'asc' ? 'carbon-arrow-down' : 'carbon-arrow-up']" />
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of sorted" :key="item.name" border="b dashed transparent hover:base">
        <td w-0 ws-nowrap text-center text-sm op25>
          {{ startTimes.indexOf(item.start) }}
        </td>
        <td w-0 ws-nowrap text-right :style="{ color: getHashColorFromString(getNamePrefix(item.name)) }">
          <code text-sm>{{ getNamePrefix(item.name) }}</code>
        </td>
        <td ws-nowrap>
          <code text-sm>{{ getNameRest(item.name) }}</code>
        </td>
        <td w-0 text-center text-sm>
          {{ item.listeners }}
        </td>
        <td w-0 text-center text-sm>
          {{ item.executions.length + 1 }}
        </td>
        <td w-0 text-right text-sm>
          <DurationDisplay :duration="item.duration" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
