<script setup lang="ts">
import { objectPick } from '@antfu/utils'

definePageMeta({
  icon: 'carbon-tree-view-alt',
  title: 'Pages',
  requireClient: true,
})

const client = useClient()
const serverPages = await rpc.getServerPages()

const pages = $computed(() => {
  return (client.value?.app.vueApp.config.globalProperties.$router?.getRoutes() || [])
    .map(i => objectPick(i, ['path', 'name', 'meta', 'props', 'children']))
    .map((i) => {
      return {
        ...serverPages.find(j => j.name && j.name === i.name),
        ...i,
      }
    })
})

const tree = toTree(pages, 'Pages')
</script>

<template>
  <div v-if="client">
    <SectionBlock
      icon="carbon-tree-view-alt"
      text="Pages"
    >
      <ModuleTreeNode :node="tree" />
      <pre>{{ pages }}</pre>
    </SectionBlock>
  </div>
</template>
