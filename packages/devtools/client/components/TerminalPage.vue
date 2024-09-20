<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { ensureDevAuthToken } from '~/composables/dev-auth'
import { rpc } from '~/composables/rpc'
import { useTerminals } from '~/composables/state'
import { useCurrentTerminalId } from '~/composables/state-routes'

const terminals = useTerminals()
const terminalId = useCurrentTerminalId()
const selected = computed(() => terminals.value?.find(t => t.id === terminalId.value))

async function remove(id: string) {
  rpc.runTerminalAction(await ensureDevAuthToken(), id, 'remove')
}

watchEffect(() => {
  if (!terminalId.value && terminals.value?.length)
    terminalId.value = terminals.value[0].id
})
</script>

<template>
  <div v-if="terminals?.length" h-full w-full of-hidden grid="~ rows-[max-content_1fr_max-content]">
    <!-- TODO: Refactor to have general component -->
    <div flex="~" border="b base" flex-1 items-center n-navbar-glass>
      <button
        v-for="t of terminals"
        :key="t.id" border="r base"
        flex="~ gap-2" items-center px3 py2
        :class="t.id === selected?.id ? 'bg-active' : ''"
        @click="terminalId = t.id"
      >
        <NIcon v-if="t.icon " :icon="t.icon" />
        <span :class="t.id === selected?.id ? '' : 'op50'">
          {{ t.name }}{{ t.isTerminated ? ' (terminated)' : '' }}
        </span>
        <NButton
          v-if="t.isTerminated"
          icon="carbon-close" mx--2
          :border="false"
          @click.stop="remove(t.id)"
        />
      </button>
    </div>

    <template v-if="selected">
      <TerminalView :id="selected.id" :key="selected.id" />
    </template>
    <template v-else>
      <div p10>
        Terminal <code>{{ terminalId }}</code> not found
      </div>
    </template>
  </div>
  <div v-else h-full flex items-center justify-center>
    <em op50>No terminal attached</em>
  </div>
</template>

<style>
.xterm {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
