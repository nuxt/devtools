<script setup lang="ts">
// `@nuxt/devtools-kit` here is v3 (see ../../package.json): this exercises the
// `__NUXT_DEVTOOLS__` injection and `extendClientRpc` a published module's
// iframe still relies on.
import type { ClientFunctions, ServerFunctions } from '../module'
import { onDevtoolsClientConnected, useDevtoolsClient } from '@nuxt/devtools-kit/iframe-client'

const client = useDevtoolsClient()
const echoed = ref<string>()
const greeted = ref<string>()

onDevtoolsClientConnected(async (client) => {
  const rpc = client.devtools.extendClientRpc<ServerFunctions, ClientFunctions>('legacy-kit-v3', {
    greet(name) {
      greeted.value = name
    },
  })
  echoed.value = await rpc.echo('ping')
})
</script>

<template>
  <div style="font-family: monospace; padding: 1rem">
    <h1>Legacy kit v3 page</h1>
    <p data-testid="connected">
      connected: {{ client ? 'yes' : 'no' }}
    </p>
    <p data-testid="host-vue">
      host vue: {{ client?.host?.nuxt.vueApp.version ?? '-' }}
    </p>
    <p data-testid="echo">
      echo: {{ echoed ?? '-' }}
    </p>
    <p data-testid="greeted">
      greeted: {{ greeted ?? '-' }}
    </p>
  </div>
</template>
