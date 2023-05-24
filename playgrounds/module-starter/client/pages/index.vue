<script setup lang="ts">
import { onDevtoolsClientConnected, useDevtoolsClient } from '@nuxt/devtools-kit/iframe-client'
import type { ClientFunctions, ServerFunctions } from '../../types'

const client = useDevtoolsClient()

onDevtoolsClientConnected((client) => {
  const rpc = client.devtools.extendClientRpc<ServerFunctions, ClientFunctions>('custom-rpc', {
    greeting(t: string) {
      // eslint-disable-next-line no-console
      console.log(`[custom-rpc] Hello ${t}!`)
    },
  })

  rpc.toUpperCase('[custom-rpc] hello')
    // eslint-disable-next-line no-console
    .then(console.log)
    .catch(console.error)
})
</script>

<template>
  <div class="relative h-screen flex flex-col p-10 n-bg-base">
    <h1 class="text-3xl font-bold">
      My Module
    </h1>
    <div class="mb-4 opacity-50">
      Nuxt DevTools Integration
    </div>
    <div
      v-if="client"
      class="flex flex-col gap-2"
    >
      <NTip
        n="green"
        icon="carbon-checkmark"
      >
        Nuxt DevTools is connected
      </NTip>
      <div>
        The current app is using
        <code class="text-green">vue@{{ client.host.nuxt.vueApp.version }}</code>
      </div>
      <div>
        <NButton
          n="green"
          class="mt-4"
          @click="client!.host.closeDevTools()"
        >
          Close DevTools
        </NButton>
      </div>
    </div>
    <div v-else>
      <NTip n="yellow">
        Failed to connect to the client. Did you open this page inside Nuxt DevTools?
      </NTip>
    </div>

    <div class="flex-auto" />
    <ModuleAuthorNote class="mt-5" />
  </div>
</template>
