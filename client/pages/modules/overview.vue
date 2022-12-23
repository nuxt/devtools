<script setup lang="ts">
import { config } from '#imports'

definePageMeta({
  icon: 'carbon-information',
  title: 'Overview',
  order: -1,
})

const components = await rpc.getComponents()
const autoImports = await rpc.getAutoImports()
</script>

<template>
  <div p4 flex h-full>
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
