<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

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
    <Splitpanes v-else h-full of-hidden>
      <Pane class="default-theme" min-size="5" size="20" of-auto>
        <Drawer />
      </Pane>
      <Pane h-full of-auto min-size="5">
        <slot />
      </Pane>
    </Splitpanes>
  </div>
</template>
