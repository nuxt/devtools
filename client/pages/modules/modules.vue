<script setup lang="ts">
definePageMeta({
  icon: 'carbon-3d-mpr-toggle',
  title: 'Modules',
  order: 4,
})

const ignores = [
  'pages',
  'meta',
  'components',
  'imports',
  'nuxt-config-schema',
  '@nuxt/devtools',
  '@nuxt/telemetry',
]

const config = $(useServerConfig())
const modules = $computed(() => config?._installedModules || [])
const packageModules = $ref<any[]>([])
const userModules = $ref<any[]>([])

watchEffect(() => {
  packageModules.length = 0
  userModules.length = 0
  for (const m of modules) {
    if (ignores.includes(m.meta?.name))
      continue
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
      container-class="grid grid-cols-minmax-400px gap2"
      :description="`Total modules: ${packageModules.length}`"
    >
      <template #footer>
        <div>
          <span op50>Find more modules at </span><a href="https://nuxt.com/modules" target="_blank" hover="text-primary underline">nuxt.com/modules</a>
        </div>
      </template>
      <ModuleItem
        v-for="m of packageModules"
        :key="m.meta?.name || m.entryPath"
        :mod="m"
      />
    </SectionBlock>
    <SectionBlock
      v-if="userModules.length"
      icon="carbon-3d-mpr-toggle"
      text="User Modules"
      container-class="grid grid-cols-minmax-400px gap2"
      :description="`Total modules: ${userModules.length}`"
    >
      <ModuleItem
        v-for="m of userModules"
        :key="m.meta?.name || m.entryPath"
        :mod="m"
      />
    </SectionBlock>
  </div>
</template>
