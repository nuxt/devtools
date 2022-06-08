<script setup lang="ts">
definePageMeta({
  icon: 'carbon-information',
  display: 'Overview',
  order: -1,
})

const data = await rpc.getConfig()
const components = await rpc.getComponents()
const autoImports = await rpc.getAutoImports()
</script>

<template>
  <div p4 flex h-full>
    <div grid="~ cols-[max-content_1fr] gap-x-2" ma>
      <div text-right op50>
        Workspace
      </div>
      <div>{{ data.rootDir }}</div>
      <div text-right op50>
        Modules
      </div>
      <div>{{ data._installedModules.length }}</div>
      <div text-right op50>
        Plugins
      </div>
      <div>{{ data.plugins.length }}</div>
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
