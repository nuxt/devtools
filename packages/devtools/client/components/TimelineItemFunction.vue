<script setup lang="ts">
import type { TimelineEventFunction } from '../../types'
import { computed } from 'vue'
import { getHashColorFromString } from '~/composables/utils'

const props = defineProps<{
  item: TimelineEventFunction
}>()

const colorRaw = computed(() => getHashColorFromString(props.item.name, 50, 60, '_op_'))
const color = computed(() => colorRaw.value.replace(/_op_/, '1'))
const textColor = computed(() => getHashColorFromString(props.item.name, 50, 40))
const colorBackground = computed(() => colorRaw.value.replace(/_op_/, '0.2'))
</script>

<template>
  <button
    class="group"
    :style="{
      color,
      borderLeft: `2px solid ${color}`,
    }"
    relative text-sm transition hover:z-1000 bg-base
  >
    <div
      :style="{
        backgroundColor: colorBackground,
      }"
      absolute bottom-0 left--1px top-0 w-full text-sm transition-all duration-300
    />
    <div
      :style="{
        'color': textColor,
        '--c': color,
      }"
      border="r-2 t-2 y-2 transparent"
      min-w-max px1 text-left group-hover="border-$c"
    >
      {{ item.name }}
    </div>
  </button>
</template>
