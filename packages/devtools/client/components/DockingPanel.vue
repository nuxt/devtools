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
</script>

<template>
  <div>
    <div px3 py2 border="b base" flex="~ gap-2">
      <NButton v-if="client?.popup" n="sm primary" @click="client.popup()">
        <div carbon-launch /> Popup
      </NButton>
      <NDarkToggle v-slot="{ toggle, isDark }">
        <NButton n="sm primary" @click="toggle">
          <div carbon-sun dark:carbon-moon translate-y--1px /> {{ isDark.value ? 'Dark' : 'Light' }}
        </NButton>
      </NDarkToggle>
      <NButton n="sm primary" to="/settings">
        <div carbon-settings-adjust translate-y--1px /> Settings
      </NButton>
    </div>
    <div px3 py2 flex="~ gap2">
      <NButton n="solid primary xs" @click="refreshData">
        Refetch Data
      </NButton>
      <NButton n="solid primary xs" @click="refreshPage">
        Refresh Page
      </NButton>
    </div>
  </div>
</template>
