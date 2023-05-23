<template>
  <Teleport to="body">
    <div
      v-if="wsConnectingDebounced"
      flex="~ col justify-center items-center gap-2"
      fixed bottom-0 left-0 right-0 top-0 z-2147483646 p5 text-lg backdrop-blur-5 glass-effect
    >
      <div flex="~" mt--10 items-center justify-center>
        <NuxtLogo h-14 />
      </div>
      <div v-if="wsError" flex="~ gap-2" items-center text-rose>
        <NIcon icon="i-carbon-wifi-off" />
        WebSocket disconnected
      </div>
      <div v-else flex="~ gap-2" animate-pulse items-center text-yellow>
        <NIcon icon="i-carbon-circle-dash" animate-spin />
        Connecting to the server...
      </div>
    </div>
  </Teleport>
</template>
