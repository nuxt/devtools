<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import type { NuxtDevtoolsHostClient, NuxtDevtoolsGlobal as NuxtDevtoolsViewGlobal } from '../../../types'
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
  setupClient()
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

function refreshReactivity() {
  props.client?.hooks.callHook('host:update:reactivity')
}

function setupClient() {
  const client = computed(() => props.client)

  watch(() => [
    client.value?.nuxt.payload,
    client.value.colorMode.value,
    client.value.loadingTimeMetrics,
  ], () => {
    refreshReactivity()
  }, { deep: true })

  // trigger update for route change
  client.value?.nuxt.vueApp.config.globalProperties?.$router?.afterEach(() => {
    refreshReactivity()
  })

  // trigger update for app mounted
  client.value?.nuxt.hook('app:mounted', () => {
    refreshReactivity()
  })

  updateClient()
}

onMounted(() => {
  props.client.refreshState()
  props.client.hooks.hook('devtools:navigate', (path) => {
    state.value.route = path
  })
})

function updateClient() {
  const injection = iframe.value?.contentWindow?.__NUXT_DEVTOOLS_VIEW__ as NuxtDevtoolsViewGlobal
  props.client.refreshState()
  injection?.setClient(props.client)
}

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
