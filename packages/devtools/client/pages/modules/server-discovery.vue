<script setup lang="ts">
import { useRuntimeConfig } from '#app/nuxt'
import { definePageMeta } from '#imports'
import { connectToEmbedApp } from '@discoveryjs/discovery/dist/discovery-embed-host.js'
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { ensureDevAuthToken } from '../../composables/dev-auth'
import { rpc } from '../../composables/rpc'
import { jsonStringifyCircular } from '../../composables/utils'

definePageMeta({
  icon: 'i-carbon-settings-view',
  title: 'Nuxt Options Viewer',
  layout: 'full',
  category: 'advanced',
  requireAuth: true,
})

const runtime = useRuntimeConfig()
const baseURL = runtime.app.baseURL

const iframe = useTemplateRef<HTMLIFrameElement>('iframe')

onMounted(() => {
  const disconnect = connectToEmbedApp(iframe.value!, (app) => {
    (async () => {
      const data = await rpc.getServerData(await ensureDevAuthToken())
      const json = `{${Object.entries(data).map(([key, value]) => `"${key}": ${jsonStringifyCircular(value)}`).join(',')}}`
      // @ts-expect-error missing API
      app.uploadData(json)
    })()
    return () => {}
  })

  onUnmounted(() => {
    disconnect()
  })
})
</script>

<template>
  <iframe ref="iframe" :src="`${baseURL}discovery/index.html`" h-full w-full />
</template>
