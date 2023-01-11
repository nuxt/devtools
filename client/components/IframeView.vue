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
    iframeEl = map.get(key)!
    iframeEl.style.visibility = 'visible'
  }
  else {
    iframeEl = document.createElement('iframe')
    map.set(key, iframeEl)
    iframeEl.src = tab.view.src
    iframeEl!.style.opacity = '0.01'
    iframeEl.onload = () => {
      syncColorMode()
      iframeEl!.style.opacity = '1'
    }
    document.body.appendChild(iframeEl)
    nextTick(updateIframeBox)
  }
  setTimeout(syncColorMode, 100)
})

watchEffect(updateIframeBox)
watchEffect(syncColorMode)

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

function updateIframeBox() {
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
</script>

<template>
  <div ref="anchor" w-full h-full />
</template>
