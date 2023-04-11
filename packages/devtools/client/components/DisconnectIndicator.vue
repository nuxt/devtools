<script setup lang="ts">
</script>

<template>
  <div
    v-if="wsError || wsConnecting"
    border="t base"
    fixed left-0 right-0 bottom-0 p5 glass-effect z-200
  >
    <div v-if="wsError" flex="~ gap-2" items-center text-rose>
      <NIcon icon="i-carbon-wifi-off" />
      WebSocket disconnected
    </div>
    <div v-else-if="wsConnecting" flex="~ gap-2" items-center text-yellow animate-pulse>
      <NIcon icon="i-carbon-circle-dash" animate-spin />
      Connecting to the server...
    </div>
  </div>
</template>
