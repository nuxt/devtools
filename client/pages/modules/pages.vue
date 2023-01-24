<script setup lang="ts">
import { objectPick } from '@antfu/utils'
import type { RouteInfo } from '~~/../src/types'

definePageMeta({
  icon: 'carbon-tree-view-alt',
  title: 'Pages',
  requireClient: true,
})

const client = useClient()
const serverPages = await rpc.getServerPages()

// const router = $computed(() => client.value?.nuxt.vueApp.config.globalProperties.$router)
const route = $computed(() => client.value?.nuxt.vueApp.config.globalProperties.$route)
const pages = $computed((): RouteInfo[] => {
  return (client.value?.nuxt.vueApp.config.globalProperties.$router?.getRoutes() || [])
    .map(i => objectPick(i, ['path', 'name', 'meta', 'props', 'children']))
    .map((i) => {
      return {
        ...serverPages.find(j => j.name && j.name === i.name),
        ...i,
      }
    })
})
</script>

<template>
  <div v-if="client">
    <LayoutsSection />
    <SectionBlock
      icon="carbon-tree-view-alt"
      text="Pages"
    >
      <PagesTable :pages="pages" />
      <!-- <ModuleTreeNode :node="tree" /> -->
    </SectionBlock>
  </div>
</template>
