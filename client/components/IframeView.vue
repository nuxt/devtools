<script setup lang="ts">
import type { ModuleIframeTab } from '~/../src/types'

const { tab } = defineProps<{
  tab: ModuleIframeTab
}>()

const colorMode = useColorMode()
const iframeEl = $ref<HTMLIFrameElement>()

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
  <iframe ref="iframeEl" :src="tab.view?.src" class="w-full h-full" @load="syncColorMode" />
</template>
