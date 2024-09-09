<script setup lang="ts">
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import type { TerminalInfo } from '../../src/types'
import '@xterm/xterm/css/xterm.css'

const props = defineProps<{
  id: string
}>()

const container = ref<HTMLElement>()
const nuxt = useNuxtApp()
const info = ref<TerminalInfo>()
let term: Terminal

onMounted(async () => {
  term = new Terminal({
    convertEol: true,
    cols: 80,
    screenReaderMode: true,
  })
  const fitAddon = new FitAddon()
  term.loadAddon(fitAddon)
  term.open(container.value!)
  fitAddon.fit()

  useEventListener(window, 'resize', () => {
    fitAddon.fit()
  })

  info.value = await rpc.getTerminalDetail(await ensureDevAuthToken(), props.id)
  if (info.value?.buffer)
    term.write(info.value.buffer)

  // @ts-expect-error missing hooks type
  nuxt.hook('devtools:terminal:data', ({ id, data }) => {
    if (id === props.id)
      term.write(data)
  })
})

async function clear() {
  rpc.runTerminalAction(await ensureDevAuthToken(), props.id, 'clear')
  term?.clear()
}

async function restart() {
  rpc.runTerminalAction(await ensureDevAuthToken(), props.id, 'restart')
}

async function terminate() {
  rpc.runTerminalAction(await ensureDevAuthToken(), props.id, 'terminate')
}
</script>

<template>
  <div ref="container" h-full w-full of-auto bg-black />
  <div border="t base" flex="~ gap-2" items-center p2>
    <NButton title="Clear" icon="i-carbon-clean" :border="false" @click="clear()" />
    <NButton v-if="info?.restartable" title="Restart" icon="carbon-renew" :border="false" @click="restart()" />
    <NButton v-if="info?.terminatable" title="Terminate" icon="carbon-delete" :border="false" @click="terminate()" />
    <span text-sm op50>{{ info?.description }}</span>
  </div>
</template>
