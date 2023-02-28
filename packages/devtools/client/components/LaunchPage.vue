<script setup lang="ts">
import type { ModuleLaunchAction } from '~~/../src/types'

defineProps<{
  icon?: string
  title?: string
  description?: string
  actions?: ModuleLaunchAction[]
}>()

defineEmits<{
  (e: 'action', idx: number): void
}>()
</script>

<template>
  <div flex="~ col gap2" h-full items-center justify-center>
    <TabIcon text-5xl mb4 :icon="icon || icon" :title="title" />
    <h1 text-xl>
      {{ title }}
    </h1>
    <NMarkdown v-if="description" op50 text-center text-base mt--1 mb2 :markdown="description" />
    <div flex="~ gap2 wrap">
      <template v-for="action, idx of actions" :key="idx">
        <NButton
          n="solid primary"
          :disabled="action.pending"
          :to="action.src"
          :target="action.src ? '_blank' : undefined"
          v-bind="action.attrs"
          @click="() => { action.handle?.(); $emit('action', idx) }"
        >
          <NIcon v-if="action.pending" icon="carbon-circle-dash" animate-spin />
          {{ action.label }}
        </NButton>
      </template>
    </div>
  </div>
</template>
