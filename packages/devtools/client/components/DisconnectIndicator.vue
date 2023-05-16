<script setup lang="ts">
</script>

<template>
  <Teleport to="body">
    <div
      v-if="wsError || wsConnecting"
      border="t base"
      fixed bottom-0 left-0 right-0 z-2147483646 p5 glass-effect
    >
      <div v-if="wsError" flex="~ gap-2" items-center text-rose>
        <NIcon icon="i-carbon-wifi-off" />
        WebSocket disconnected
      </div>
      <div v-else-if="wsConnecting" flex="~ gap-2" animate-pulse items-center text-yellow>
        <NIcon icon="i-carbon-circle-dash" animate-spin />
        Connecting to the server...
      </div>
    </div>
  </Teleport>
</template>
