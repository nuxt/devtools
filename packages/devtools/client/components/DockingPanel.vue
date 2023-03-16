<script setup lang="ts">
const frameState = useDevToolsFrameState()

const client = useClient()
const nuxt = useNuxtApp()

function refreshData() {
  nuxt.hooks.callHookParallel('app:data:refresh', Object.keys(nuxt.payload.data))
  // TODO: use triggerRef after: https://github.com/vuejs/core/pull/7507
  // triggerRef(client)
  if (client.value)
    client.value = { ...client.value }
}

function refreshPage() {
  location.reload()
}
</script>

<template>
  <div>
    <div v-if="client" py2 px3 border="b base" flex="~ col gap-1">
      <div text-sm op50>
        Dock devtools to
      </div>
      <div flex="~ gap-1" text-lg>
        <button
          i-carbon-open-panel-filled-bottom
          :class="frameState.position === 'bottom' ? 'text-primary' : 'op50'"
          @click="frameState.position = 'bottom'"
        />
        <button
          i-carbon-open-panel-filled-right
          :class="frameState.position === 'right' ? 'text-primary' : 'op50'"
          @click="frameState.position = 'right'"
        />
        <button
          i-carbon-open-panel-filled-left
          :class="frameState.position === 'left' ? 'text-primary' : 'op50'"
          @click="frameState.position = 'left'"
        />
        <button
          i-carbon-open-panel-filled-top
          :class="frameState.position === 'top' ? 'text-primary' : 'op50'"
          @click="frameState.position = 'top'"
        />
      </div>
    </div>
    <div px3 py2 border="b base" flex="~ gap-2">
      <NDarkToggle v-slot="{ toggle, isDark }">
        <NButton n="sm primary" @click="toggle()">
          <div carbon-sun dark:carbon-moon translate-y--1px /> {{ isDark.value ? 'Dark' : 'Light' }}
        </NButton>
      </NDarkToggle>
      <NButton n="sm primary" to="/settings">
        <div translate-y--1px carbon-settings /> Settings
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
