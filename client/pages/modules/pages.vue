<script setup lang="ts">
definePageMeta({
  icon: 'carbon-tree-view-alt',
  title: 'Pages'
})

const pages = await rpc.getPages()
</script>

<template>
  <div>
    <SectionBlock
      icon="carbon-tree-view-alt"
      text="Pages"
    >
      <pre>{{ pages }}</pre>
    </SectionBlock>
  </div>
</template>
