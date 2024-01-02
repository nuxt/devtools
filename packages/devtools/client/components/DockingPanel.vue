<script setup lang="ts">
const { sidebarExpanded } = useDevToolsUIOptions()

function toggleSplitScreen() {
  splitScreenEnabled.value = !splitScreenEnabled.value
}
</script>

<template>
  <div>
    <div px3 py2 border="b base" flex="~ gap-2">
      <NDarkToggle v-slot="{ toggle, isDark }">
        <NButton n="sm primary" @click="toggle">
          <div i-carbon-sun dark:i-carbon-moon translate-y--1px /> {{ isDark.value ? 'Dark' : 'Light' }}
        </NButton>
      </NDarkToggle>
      <NButton n="sm primary" @click="sidebarExpanded = !sidebarExpanded">
        <NIcon :icon="sidebarExpanded ? 'i-carbon-side-panel-close' : 'i-carbon-side-panel-open'" />
        {{ sidebarExpanded ? 'Minimize Sidebar' : 'Expand Sidebar' }}
      </NButton>
      <NButton n="sm primary" to="/settings">
        <div i-carbon-settings-adjust /> Settings
      </NButton>
    </div>
    <div px3 py2 border="b base" flex="~ gap-2">
      <NButton v-if="splitScreenAvailable" n="sm primary" @click="toggleSplitScreen">
        <div i-carbon-split-screen />
        {{ splitScreenEnabled ? 'Close Split Screen' : 'Split Screen' }}
      </NButton>
      <PictureInPictureButton />
    </div>
    <div px3 py2 flex="~ gap2">
      <NButton n="primary sm" @click="refreshData">
        Refetch Data
      </NButton>
      <NButton n="primary sm" @click="reloadPage">
        Reload Page
      </NButton>
    </div>
  </div>
</template>
