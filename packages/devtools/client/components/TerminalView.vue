<script setup lang="ts">
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import type { TerminalInfo } from '../../src/types'

const props = defineProps<{
  id: string
}>()

const container = ref<HTMLElement>()
const nuxt = useNuxtApp()
const info = ref<TerminalInfo>()
const router = useRouter()
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

  info.value = await rpc.getTerminalDetail(props.id)
  if (info.value?.buffer)
    term.write(info.value.buffer)

  // @ts-expect-error missing hooks type
  nuxt.hook('devtools:terminal:data', ({ id, data }) => {
    if (id === props.id)
      term.write(data)
  })
})

function clear() {
  rpc.runTerminalAction(props.id, 'clear')
  term?.clear()
}
</script>

<template>
  <div ref="container" h-full w-full of-auto bg-black />
  <div border="t base" flex="~ gap-2" items-center p2>
    <NIconButton title="Clear" icon="i-carbon-clean" @click="clear()" />
    <NIconButton v-if="info?.restartable" title="Restart" icon="carbon-renew" @click="rpc.runTerminalAction(id, 'restart')" />
    <NIconButton v-if="info?.terminatable" title="Terminate" icon="carbon-delete" @click="rpc.runTerminalAction(id, 'terminate')" />
    <span op50 text-sm>{{ info?.description }}</span>
  </div>
</template>
