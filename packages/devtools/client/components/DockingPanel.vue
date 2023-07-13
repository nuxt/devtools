<script setup lang="ts">
const client = useClient()
const nuxt = useNuxtApp()

function refreshData() {
  nuxt.hooks.callHookParallel('app:data:refresh', Object.keys(nuxt.payload.data))
  triggerRef(client)
}

function refreshPage() {
  location.reload()
}

function toggleSplitScreen() {
  splitScreen.value = !splitScreen.value
}
</script>

<template>
  <div>
    <div px3 py2 border="b base" flex="~ gap-2">
      <NDarkToggle v-slot="{ toggle, isDark }">
        <NButton n="sm primary" @click="toggle">
          <div carbon-sun translate-y--1px dark:carbon-moon /> {{ isDark.value ? 'Dark' : 'Light' }}
        </NButton>
      </NDarkToggle>
      <NButton n="sm primary" to="/settings">
        <div i-carbon-settings-adjust /> Settings
      </NButton>
      <PictureInPictureButton />
    </div>
    <div px3 py2 flex="~ gap2">
      <NButton n="sm primary" @click="toggleSplitScreen">
        <div i-carbon-split-screen />
        {{ splitScreen ? 'Unsplit Screen' : 'Split Screen' }}
      </NButton>
      <NButton n="primary sm" @click="refreshData">
        Refetch Data
      </NButton>
      <NButton n="primary sm" @click="refreshPage">
        Refresh Page
      </NButton>
    </div>
  </div>
</template>
