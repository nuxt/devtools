<template>
  <Teleport to="body">
    <div
      v-if="wsConnectingDebounced"
      flex="~ col justify-center items-center gap-4"
      fixed bottom-0 left-0 right-0 top-0 z-2147483646 p5 text-lg backdrop-blur-5 n-glass-effect
    >
      <div flex="~" items-center justify-center>
        <NuxtLogo h-8 />
      </div>
      <div border="t base" my2 h-1px w-10 />
      <div flex="~ gap-2" items-center text-xl op50>
        <NIcon icon="i-carbon-wifi-off" />
        Disconnected from Server
      </div>
      <div flex="~ gap-2" animate-pulse items-center text-xl text-orange>
        <NIcon icon="i-carbon-circle-dash" animate-spin />
        Retrying...
      </div>
    </div>
  </Teleport>
</template>
