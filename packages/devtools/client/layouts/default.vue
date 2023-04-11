<script setup lang="ts">
const client = useClient()
const waiting = computed(() => !client.value && !showConnectionWarning.value)
</script>

<template>
  <div h-screen of-hidden font-sans bg-base>
    <Notification />
    <NLoading v-if="waiting">
      Connecting....
    </NLoading>
    <div v-else grid="~ cols-[50px_1fr]" h-full of-hidden>
      <SideNav of-x-hidden of-y-auto />
      <div h-full of-auto>
        <slot />
      </div>
    </div>
  </div>
</template>
