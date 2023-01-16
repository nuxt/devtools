<script setup lang="ts">
definePageMeta({
  icon: 'carbon-information',
  title: 'Overview',
  order: -1,
})

const client = useClient()
const config = $(useServerConfig())

const showConnectionWarning = ref(false)
onMounted(() => {
  setTimeout(() => {
    showConnectionWarning.value = true
  }, 2000)
})

const components = await rpc.getComponents()
const { imports: autoImports } = await rpc.getAutoImports()
</script>

<template>
  <div
    p="x4 y2" m2 flex="~ gap-2" items-center
    bg-lime:10 text-lime6 rounded
  >
    <span carbon-chemistry />Working in Progress. For early preview only.
  </div>
  <div
    v-if="!client && showConnectionWarning"
    p="x4 y2" m2 flex="~ gap-2" items-center
    bg-yellow:10 text-yellow6 rounded
  >
    <span i-carbon-unlink />Not connected to the client, showing server-side data only. Use the embedded mode for full features.
  </div>
  <div v-if="config" p4 flex="~ col" h-full>
    <div grid="~ cols-[max-content_1fr] gap-x-2 gap-y-1" ma>
      <div text-right op50>
        Workspace
      </div>
      <div>{{ config.rootDir }}</div>
      <div text-right op50>
        Modules
      </div>
      <div>{{ config._installedModules.length }}</div>
      <div text-right op50>
        Plugins
      </div>
      <div>{{ config.plugins.length }}</div>
      <div text-right op50>
        Components
      </div>
      <div>{{ components.length }}</div>
      <div text-right op50>
        Composables
      </div>
      <div>{{ autoImports.length }}</div>
    </div>
  </div>
</template>
