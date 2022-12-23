<script setup lang="ts">
definePageMeta({
  icon: 'carbon-tree-view-alt',
  title: 'Pages',
})

const pages = await rpc.getPages()
const tree = toTree(pages, 'Pages')
</script>

<template>
  <div>
    <SectionBlock
      icon="carbon-tree-view-alt"
      text="Pages"
    >
      <ModuleTreeNode :node="tree" />
      <pre>{{ pages }}</pre>
    </SectionBlock>
  </div>
</template>
