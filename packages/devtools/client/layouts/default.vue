<script setup lang="ts">
const client = useClient()
const waiting = computed(() => !client.value && !showConnectionWarning.value)
</script>

<template>
  <div of-hidden bg-base h-screen font-sans>
    <Notification />
    <div v-if="waiting" h-full w-full flex>
      <div ma text-lg flex="~ col" items-center animate-pulse>
        <div i-carbon-circle-dash animate-spin text-4xl op50 />
        Connecting...
      </div>
    </div>
    <div v-else grid="~ cols-[45px_1fr] lg:cols-[200px_1fr]" h-full of-hidden>
      <Drawer of-auto />
      <div h-full of-auto>
        <slot />
      </div>
    </div>
  </div>
</template>
