<script setup lang="ts">
definePageMeta({
  icon: 'carbon-3d-mpr-toggle',
  title: 'Modules',
  order: 5,
})

const installModuleOpen = ref(false)
const installedModules = useInstalledModules()
const terminalId = useCurrentTerminalId()

const packageModules = computed(() => installedModules.value.filter(i => i.isPackageModule))
const userModules = computed(() => installedModules.value.filter(i => !i.isPackageModule))

const iconBase = 'https://api.nuxtjs.org/api/ipx/s_80,f_webp/gh/nuxt/modules/main/icons/'

registerCommands(() => [
  {
    id: 'action:modules:install',
    title: 'Install a new module',
    icon: 'i-carbon-intent-request-create ',
    action: () => {
      installModuleOpen.value = true
    },
  },
])
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
        :key="m.name"
        :mod="m"
      />
      <NuxtLink
        v-for="m of processInstallingModules"
        :key="m.processId" block min-h-30
        to="/modules/terminals"
        @click="terminalId = m.processId"
      >
        <NCard
          border="1.5 dashed"
          h-full animate-pulse p4 transition
          hover="border-primary"
          flex="~ col gap-1 items-center justify-center"
          role="button"
          class="group"
        >
          <div relative h-20 w-20 flex flex-none rounded bg-gray:3 p3>
            <img :src="iconBase + m.info.icon" :alt="m.info.name" ma>
            <div i-carbon-cube ma text-4xl op30 />
          </div>
          <div text-lg group-hover="text-primary" transition flex="~ gap-2 items-center">
            <div i-carbon-circle-dash animate-spin text-xl op75 />
            <span op75>Installing {{ m.name }}...</span>
          </div>
        </NCard>
      </NuxtLink>
      <NCard
        border="1.5 dashed"
        min-h-30 p4 transition
        hover="border-primary"
        flex="~ col gap-2 items-center justify-center"
        role="button"
        class="group"
        @click="installModuleOpen = true"
      >
        <div i-carbon-intent-request-create text-4xl op40 group-hover="op75 text-primary" transition />
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
        <NButton
          icon="carbon-close"
          pos="absolute top-3 right-3 z-10"
          rounded-full text-xl :border="false"
          @click="installModuleOpen = false"
        />

        <ModuleInstallList @close="installModuleOpen = false" />
      </div>
    </Transition>
    <ModuleActionDialog />
  </div>

  <HelpFab>
    <DocsModules />
  </HelpFab>
</template>
