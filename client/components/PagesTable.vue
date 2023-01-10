<script setup lang="ts">
import type { RouteInfo } from '~~/../src/types'

const { pages } = defineProps<{
  pages: RouteInfo[]
}>()

const tree = $computed(() => toTree(pages, 'Pages'))
</script>

<template>
  <div>
    <ModuleTreeNode :node="tree" />
  </div>
</template>
