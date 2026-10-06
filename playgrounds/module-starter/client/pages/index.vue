<script setup lang="ts">
import type { NuxtDevtoolsHostClient } from '@nuxt/devtools-kit/types'
import type { DevToolsRpcClient } from '@vitejs/devtools-kit/client'
import { getDevToolsRpcClient } from '@vitejs/devtools-kit/client'

const kit = shallowRef<DevToolsRpcClient>()
const result = ref<string>()

// The host app injects its client on the parent window; same-origin iframes can read it.
const host = (window.parent as Window & { __NUXT_DEVTOOLS_HOST__?: NuxtDevtoolsHostClient }).__NUXT_DEVTOOLS_HOST__

onMounted(async () => {
  kit.value = await getDevToolsRpcClient()
  // Everything registered or called through the scope is prefixed with `my-module:`
  const { rpc } = kit.value.scope('my-module')

  rpc.register({
    name: 'greeting',
    type: 'event',
    handler(t: string) {
      // eslint-disable-next-line no-console
      console.log(`[my-module] Hello ${t}!`)
    },
  })

  result.value = await rpc.call('to-upper-case', '[my-module] hello')
})
</script>

<template>
  <div class="relative h-screen flex flex-col n-bg-base p-10">
    <h1 class="text-3xl font-bold">
      My Module
    </h1>
    <div class="mb-4 opacity-50">
      Nuxt DevTools Integration
    </div>
    <div
      v-if="kit"
      class="flex flex-col gap-2"
    >
      <NTip
        n="green"
        icon="carbon-checkmark"
      >
        Connected to Vite DevTools RPC
      </NTip>
      <div>
        Server says: <code class="text-green">{{ result }}</code>
      </div>
      <div v-if="host">
        The current app is using
        <code class="text-green">vue@{{ host.nuxt.vueApp.version }}</code>
      </div>
      <div>
        <NButton
          n="green"
          class="mt-4"
          @click="host?.devtools.close()"
        >
          Close DevTools
        </NButton>
      </div>
    </div>
    <div v-else>
      <NTip n="yellow">
        Connecting to Vite DevTools…
      </NTip>
    </div>

    <div class="flex-auto" />
    <ModuleAuthorNote class="mt-5" />
  </div>
</template>
