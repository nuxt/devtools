<script setup lang="ts">
import type { TerminalData } from '~~/../src/types'

definePageMeta({
  icon: 'carbon-terminal',
  title: 'Terminals',
})

const terminals = await rpc.listTerminals()

const selected = ref<TerminalData>(terminals[0])
</script>

<template>
  <div v-if="terminals.length" h-full w-full of-hidden grid="~ rows-[max-content_max-content_1fr]">
    <!-- TODO: Refactor to have general component -->
    <div ref="navbar" flex="~ gap-2" border="b base" navbar-glass flex-1 items-center>
      <button v-for="t of terminals" :key="t.id" border="r base" px3 py2 flex="~ gap-1" items-center @click="selected = t">
        <NIcon v-if="t.icon " :icon="t.icon" />
        {{ t.name }}
      </button>
    </div>

    <template v-if="selected">
      <div border="b base" p2 flex="~">
        <span>{{ selected.description }}</span>
        <span class="flex-auto" />
        <!-- TODO: -->
        <NIconButton title="Refresh" icon="carbon-renew" />
      </div>
      <TerminalView :id="selected.id" :key="selected.id" />
    </template>
  </div>
  <div h-full items-center flex justify-center>
    <em op50>No terminal attached</em>
  </div>
</template>
