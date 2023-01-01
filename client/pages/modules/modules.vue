<script setup lang="ts">
import { config } from '#imports'

definePageMeta({
  icon: 'carbon-3d-mpr-toggle',
  title: 'Modules',
})

const modules = $computed(() => config._installedModules)
const packageModules = $ref<any[]>([])
const userModules = $ref<any[]>([])

watchEffect(() => {
  packageModules.length = 0
  userModules.length = 0
  for (const m of modules) {
    if (m.entryPath && isNodeModulePath(m.entryPath))
      packageModules.push(m)
    else
      userModules.push(m)
  }
})
</script>

<template>
  <div>
    <SectionBlock
      icon="carbon-3d-mpr-toggle"
      text="Installed Modules"
      padding="grid grid-cols-minmax-400px gap2"
    >
      <template #footer>
        <div text-true-gray:50>
          Find more modules at <a href="https://nuxt.com/modules" target="_blank" hover="text-primary underline">nuxt.com/modules</a>
        </div>
      </template>
      <NuxtModule
        v-for="m of packageModules"
        :key="m.meta?.name || m.entryPath"
        :mod="m"
      />
    </SectionBlock>
    <SectionBlock
      v-if="userModules.length"
      icon="carbon-3d-mpr-toggle"
      text="User Modules"
      padding="grid grid-cols-minmax-400px gap2"
    >
      <NuxtModule
        v-for="m of userModules"
        :key="m.meta?.name || m.entryPath"
        :mod="m"
      />
    </SectionBlock>
  </div>
</template>
