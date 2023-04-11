<script setup lang="ts">
import type { TreeNode } from '~/composables/tree'

withDefaults(defineProps<{
  node: TreeNode
  icon?: string
}>(), {
  icon: 'carbon-folder',
})

const route = useRoute()
</script>

<template>
  <details open>
    <summary
      cursor-default select-none truncate text-sm
      p="y1"
      flex="~ gap2"
    >
      <div carbon-arrow />
      <div :class="icon" />
      {{ node.name }}
    </summary>

    <ModuleTreeNode v-for="e of Object.entries(node.children)" :key="e[0]" ml2 :node="e[1]" />
    <div
      v-for="i of node.items"
      :key="i.file"

      ml4 ws-nowrap
    >
      <div

        p="x2 y1"
        block rounded text-sm
        :class="{ 'bg-gray/10': i.file === route.params.id }"
      >
        <FileIcon :id="i.file" />
        <span ml-1>
          {{ i.path.split('/').pop() }}
        </span>
      </div>
    </div>
  </details>
</template>
