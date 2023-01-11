<script lang="ts">
const map = new Map<string, HTMLIFrameElement>()
</script>

<script setup lang="ts">
// eslint-disable-next-line import/first
import type { ModuleIframeTab } from '~/../src/types'

const { tab } = defineProps<{
  tab: ModuleIframeTab
}>()

const colorMode = useColorMode()
const anchor = ref<HTMLDivElement>()
const key = $computed(() => tab.name)
let iframeEl = $ref<HTMLIFrameElement>()
const box = reactive(useElementBounding(anchor))

onMounted(() => {
  if (map.get(key)) {
    map.get(key)!.style.visibility = 'visible'
  }
  else {
    iframeEl = document.createElement('iframe')
    map.set(key, iframeEl)
    iframeEl.src = tab.view.src
    iframeEl.onload = syncColorMode
    document.body.appendChild(iframeEl)
    nextTick(update)
  }
})

watchEffect(update)

function update() {
  if (!iframeEl)
    return
  Object.assign(iframeEl.style, {
    position: 'fixed',
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    outline: 'none',
  })
}

onUnmounted(() => {
  if (iframeEl)
    iframeEl.style.visibility = 'hidden'
})

function syncColorMode() {
  if (!iframeEl || !iframeEl.contentWindow)
    return
  try {
    const html = iframeEl.contentWindow!.document.querySelector('html')
    html?.classList.toggle('dark', colorMode.value === 'dark')
    html?.classList.toggle('light', colorMode.value === 'dark')
  }
  catch (e) {
    console.error(e)
  }
}

watchEffect(syncColorMode)
onMounted(() => {
  setTimeout(syncColorMode, 100)
})
</script>

<template>
  <div ref="anchor" w-full h-full />
</template>
