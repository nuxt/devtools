<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import type { NuxtDevtoolsHostClient } from '../../../types'
import { closePanel, state } from './state'
import { useEventListener } from './utils'
import { CLIENT_PATH } from './constants'

const props = defineProps<{
  client: NuxtDevtoolsHostClient
}>()

const initialUrl = CLIENT_PATH + state.value.route
const iframe = ref<HTMLIFrameElement>()

async function onLoad() {
  await waitForClientInjection()
  props.client.refreshState(iframe.value)
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
  props.client.refreshState(iframe.value)
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
