<script setup lang="ts">
const client = useClient()
const waiting = computed(() => !client.value && !showConnectionWarning.value)
</script>

<template>
  <div bg-base of-hidden h-screen font-sans>
    <Notification />
    <NLoading v-if="waiting">
      Connecting....
    </NLoading>
    <div v-else grid="~ cols-[50px_1fr]" of-hidden h-full>
      <SideNav of-x-hidden of-y-auto />
      <div h-full of-auto>
        <slot />
      </div>
    </div>
  </div>
</template>
