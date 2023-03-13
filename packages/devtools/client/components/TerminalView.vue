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

  const data = await rpc.getTerminal(props.id)
  if (data?.content)
    term.write(data.content)

  nuxt.hook('devtools:terminal:data', ({ id, data }) => {
    if (id === props.id)
      term.write(data)
  })
})
</script>

<template>
  <div ref="container" h-full px4 bg-black />
</template>
