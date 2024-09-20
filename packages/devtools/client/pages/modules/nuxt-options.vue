<script setup lang="ts">
import { useRuntimeConfig } from '#app/nuxt'
import { definePageMeta } from '#imports'
import { connectToEmbedApp } from '@discoveryjs/discovery/dist/discovery-embed-host.js'
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useServerConfig } from '~/composables/state'
import { jsonStringifyCircular } from '../../composables/utils'

definePageMeta({
  icon: 'i-carbon-settings-view',
  title: 'Nuxt Options Viewer',
  layout: 'full',
})

const runtime = useRuntimeConfig()
const baseURL = runtime.app.baseURL

const iframe = useTemplateRef<HTMLIFrameElement>('iframe')

const options = useServerConfig()

onMounted(() => {
  const disconnect = connectToEmbedApp(iframe.value!, (app) => {
    app.uploadData(jsonStringifyCircular(options))
  })

  onUnmounted(() => {
    disconnect()
  })
})
</script>

<template>
  <iframe ref="iframe" :src="`${baseURL}discovery/index.html`" h-full w-full />
</template>
