<script setup lang="ts">
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

const props = defineProps<{
  id: string
}>()

const container = ref<HTMLElement>()
const nuxt = useNuxtApp()

onMounted(async () => {
  const term = new Terminal({
    cursorBlink: true,
    convertEol: true,
    cols: 140,
  })
  const fitAddon = new FitAddon()
  term.loadAddon(fitAddon)
  term.open(container.value!)
  fitAddon.fit()

  useEventListener(window, 'resize', () => {
    fitAddon.fit()
  })

  const data = await rpc.getTerminalDetail(props.id)
  if (data?.buffer)
    term.write(data.buffer)

  nuxt.hook('devtools:terminal:data', (id: string, data: string) => {
    if (id === props.id)
      term.write(data)
  })
})
</script>

<template>
  <div ref="container" h-full w-full of-auto px4 bg-black />
</template>
