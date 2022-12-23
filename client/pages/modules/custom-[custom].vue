<script setup lang="ts">
import type { ModuleCustomTab } from '~/../src/types'

const mode = useColorMode()
const route = useRoute()

const name = $computed(() => route.params.custom)
const tab = $computed(() => tabsInfo.find(i => i.name === name) as ModuleCustomTab)

const iframeEl = $ref<HTMLIFrameElement>()

function syncColorMode() {
  if (!iframeEl)
    return
  try {
    const html = iframeEl.contentWindow.document.querySelector('html')
    html.classList.toggle('dark', mode.value === 'dark')
    html.classList.toggle('light', mode.value === 'dark')
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
  <iframe ref="iframeEl" :src="tab.view.src" class="w-full h-full" @load="syncColorMode" />
</template>
