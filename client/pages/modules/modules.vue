<script setup lang="ts">
import { config } from '#imports'

definePageMeta({
  icon: 'carbon-3d-mpr-toggle',
  title:'Modules',
})
</script>

<template>
  <div>
    <SectionBlock
      icon="carbon-3d-mpr-toggle"
      text="Modules"
      padding="grid grid-cols-minmax-400px gap2"
    >
      <NuxtModule
        v-for="m of config._installedModules"
        :key="m.meta?.name || m.entryPath"
        :mod="m"
      />
    </SectionBlock>
  </div>
</template>
