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

const config = useServerConfig()
const modules = computed(() => config.value?._installedModules || [])
const packageModules = ref<any[]>([])
const userModules = ref<any[]>([])
const installModuleOpen = ref(false)

watchEffect(() => {
  packageModules.value.length = 0
  userModules.value.length = 0
  for (const m of modules.value) {
    if (ignores.includes(m.meta?.name))
      continue
    if (m.entryPath && isNodeModulePath(m.entryPath))
      packageModules.value.push(m)
    else
      userModules.value.push(m)
  }
})
</script>

<template>
  <div h-full w-full of-auto>
    <NSectionBlock
      icon="carbon-3d-mpr-toggle"
      text="Installed Modules"
      container-class="grid grid-cols-minmax-400px gap3 px4"
      :padding="false"
      :description="`Total modules: ${packageModules.length}`"
    >
      <ModuleItem
        v-for="m of packageModules"
        :key="m.meta?.name || m.entryPath"
        :mod="m"
      />
      <NCard
        border="1.5 dashed"
        min-h-30 p4 transition
        hover="border-primary"
        flex="~ col gap-2 items-center justify-center"
        role="button"
        class="group"
        @click="installModuleOpen = true"
      >
        <div i-carbon-new-tab text-4xl op40 group-hover="op75 text-primary" transition />
        <div text-lg op40 group-hover="op75 text-primary" transition>
          Install New Module
        </div>
      </NCard>
    </NSectionBlock>
    <NSectionBlock
      v-if="userModules.length"
      icon="carbon-3d-mpr-toggle"
      text="User Modules"
      container-class="grid grid-cols-minmax-400px gap3 px4"
      :padding="false"
      :description="`Total modules: ${userModules.length}`"
    >
      <template v-for="m of userModules" :key="m.meta?.name || m.entryPath">
        <ModuleItem
          v-if="m.meta?.name || m.entryPath"
          :mod="m"
        />
      </template>
    </NSectionBlock>

    <Transition name="fade-in">
      <div
        v-if="installModuleOpen"
        class="fixed bottom-0 left-0 right-0 top-0 z-100"
        bg-black:20 backdrop-blur-2 @click="installModuleOpen = false"
      />
    </Transition>
    <Transition name="slide-in">
      <div
        v-if="installModuleOpen" border="l base"
        pos="fixed bottom-0 right-0 top-0" z-200 w-150 bg-base
      >
        <NIconButton
          icon="carbon-close"
          pos="absolute top-3 right-3"
          rounded-full text-xl
          @click="installModuleOpen = false"
        />

        <ModuleInstallList />
      </div>
    </Transition>
  </div>

  <HelpFab>
    <DocsModules />
  </HelpFab>
</template>
