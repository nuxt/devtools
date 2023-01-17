<script setup lang="ts">
import type { NuxtAppClient } from '~~/../src/types'

definePageMeta({
  icon: 'carbon-ibm-cloud-direct-link-2-connect',
  title: 'Hooks',
})

const serverHooks = await rpc.getServerHooks()

const state = useState<NuxtAppClient>('devtools-client')

const clientHooks = state.value?.getHooksMetrics()
</script>

<template>
  <div>
    <SectionBlock
      v-if="clientHooks?.length"
      icon="carbon-ibm-cloud-direct-link-1-dedicated-hosting"
      text="Client Hooks"
      :description="`Total hooks: ${clientHooks.length}`"
    >
      <HooksTable :hooks="clientHooks" />
    </SectionBlock>
    <SectionBlock
      icon="carbon-ibm-cloud-direct-link-2-dedicated"
      text="Server Hooks"
      :description="`Total hooks: ${serverHooks.length}`"
    >
      <HooksTable :hooks="serverHooks" />
    </SectionBlock>
  </div>
</template>
