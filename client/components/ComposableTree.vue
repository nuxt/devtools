<script setup lang="ts">
import type { Import, UnimportMeta } from 'unimport'
import { getShortPath, openInEditor } from '#imports'

const { metadata } = defineProps<{
  map: Map<string, Import[]>
  root: string
  metadata?: UnimportMeta
}>()
</script>

<template>
  <div>
    <div v-for="[key, value] of map.entries()" :key="key">
      <button op50 hover:underline @click="openInEditor(key)">
        <code font-mono text-sm>{{ getShortPath(key, root) }}</code>
      </button>
      <div flex="~ wrap gap2" p2 pl4>
        <ComposableItem v-for="i of value" :key="i.as" :import="i" :metadata="metadata" />
      </div>
    </div>
  </div>
</template>
