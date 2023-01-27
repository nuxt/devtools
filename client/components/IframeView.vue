<script lang="ts">
const iframeCacheMap = new Map<string, HTMLIFrameElement>()
</script>

<script setup lang="ts">
// eslint-disable-next-line import/first
import type { ModuleCustomTab, ModuleIframeView, NuxtDevtoolsIframeClient } from '~/../src/types'

const { tab } = defineProps<{
  tab: ModuleCustomTab
}>()

const client = useClient()
const colorMode = useColorMode()
const anchor = ref<HTMLDivElement>()
const key = $computed(() => tab.name)
let iframeEl = $ref<HTMLIFrameElement>()
const box = reactive(useElementBounding(anchor))

onMounted(() => {
  const view = tab.view as ModuleIframeView
  const isPersistent = view.persistent !== false

  if (iframeCacheMap.get(key) && isPersistent) {
    iframeEl = iframeCacheMap.get(key)!
    iframeEl.style.visibility = 'visible'
  }
  else {
    iframeEl = document.createElement('iframe')
    if (isPersistent)
      iframeCacheMap.set(key, iframeEl)
    iframeEl.src = view.src
    // CORS
    try {
      iframeEl!.style.opacity = '0.01'
      iframeEl.onload = () => {
        injectClient()
        syncColorMode()
        iframeEl!.style.opacity = '1'
      }
    }
    catch (e) {
      iframeEl!.style.opacity = '1'
    }
    document.body.appendChild(iframeEl)
    nextTick(updateIframeBox)
  }
  setTimeout(syncColorMode, 100)
})

watchEffect(updateIframeBox)
watchEffect(syncColorMode)
watchEffect(injectClient)

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
  }
}

function injectClient() {
  if (!iframeEl || !iframeEl.contentWindow)
    return

  try {
    iframeEl.contentWindow!.__NUXT_DEVTOOLS__ = {
      host: client.value,
      devtools: {
        rpc,
      },
    } satisfies NuxtDevtoolsIframeClient
  }
  catch (e) {
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
