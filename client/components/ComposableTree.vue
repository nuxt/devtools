<script setup lang="ts">
import type { Import } from 'unimport'
import { getShortPath, openInEditor } from '#imports'

defineProps<{
  map: Map<string, Import[]>
  root: string
}>()

const copy = useCopy()
</script>

<template>
  <div>
    <div v-for="[key, value] of map.entries()" :key="key">
      <button op50 hover:underline @click="openInEditor(key)">
        <code font-mono>{{ getShortPath(key, root) }}</code>
      </button>
      <div flex="~ wrap gap2" p2 pl4>
        <button v-for="i of value" :key="i.as" hover:text-primary @click="copy(i.as || i.name)">
          <code bg-gray:10 px2 rounded font-mono>
            {{ i.as || i.name }}
          </code>
        </button>
      </div>
    </div>
  </div>
</template>
