<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import type { NuxtDevtoolsHostClient } from '../../../types'
import { closePanel, state } from './state'
import { useEventListener } from './utils'

const props = defineProps<{
  client: NuxtDevtoolsHostClient
}>()

const CLIENT_PATH = '/__nuxt_devtools__/client'

const initialUrl = CLIENT_PATH + state.value.route
const iframe = ref<HTMLIFrameElement>()

async function onLoad() {
  await waitForClientInjection()
  props.client.updateClient(iframe.value)
}

function waitForClientInjection(retry = 10, timeout = 200) {
  const test = () => !!iframe.value?.contentWindow?.__NUXT_DEVTOOLS_VIEW__

  if (test())
    return

  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      if (test()) {
        clearInterval(interval)
        resolve()
      }
      else if (retry-- <= 0) {
        clearInterval(interval)
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Nuxt Devtools client injection failed')
      }
    }, timeout)
  })
}

onMounted(() => {
  const documentPictureInPicture = window.documentPictureInPicture
  if (documentPictureInPicture?.requestWindow) {
    let pipWindow: Window | null = null
    // eslint-disable-next-line vue/no-mutating-props
    props.client.popup = async () => {
      if (pipWindow) {
        document.exitPictureInPicture()
      }
      else {
        pipWindow = await documentPictureInPicture.requestWindow({
          width: iframe.value!.clientWidth,
          height: iframe.value!.clientHeight,
        }) as Window
        const style = pipWindow.document.createElement('style')
        style.innerHTML = `
          body {
            margin: 0;
            padding: 0;
          }
          iframe {
            width: 100vw;
            height: 100vh;
            border: none;
            outline: none;
          }
        `
        pipWindow.__NUXT_DEVTOOLS_DISABLE__ = true
        pipWindow.document.head.appendChild(style)
        pipWindow.document.body.appendChild(iframe.value!)
      }
    }
  }

  props.client.updateClient(iframe.value)
  props.client.hooks.hook('devtools:navigate', (path) => {
    state.value.route = path
  })
})

useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.client.inspector?.isEnabled.value) {
    e.preventDefault()
    props.client.inspector?.disable()
    closePanel()
  }
})

watchEffect(() => {
  if (!state.value.open)
    iframe.value?.blur()
  else
    iframe.value?.focus()
})
</script>

<template>
  <iframe
    ref="iframe"
    :src="initialUrl"
    @load="onLoad"
  />
</template>
