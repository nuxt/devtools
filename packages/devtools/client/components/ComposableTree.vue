<script setup lang="ts">
import type { Import, UnimportMeta } from 'unimport'

defineProps<{
  map: Map<string, Import[]>
  root: string
  metadata?: UnimportMeta
}>()
</script>

<template>
  <div>
    <div v-for="[key, value] of map.entries()" :key="key">
      <FilepathItem :filepath="key" op50 hover:underline />
      <div flex="~ wrap gap2" p2 pl4>
        <ComposableItem v-for="i of value" :key="i.as" :item="i" :metadata="metadata" :filepath="key.match(/^[\w@]/) ? undefined : key" />
      </div>
    </div>
  </div>
</template>
