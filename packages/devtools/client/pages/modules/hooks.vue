<script setup lang="ts">
definePageMeta({
  icon: 'carbon-ibm-cloud-direct-link-2-connect',
  title: 'Hooks',
  category: 'advanced',
})

const serverHooks = useServerHooks()
const client = useClient()
const clientHooks = computed(() => client.value?.getClientHooksMetrics())
</script>

<template>
  <div>
    <NSectionBlock
      v-if="clientHooks?.length"
      icon="carbon-ibm-cloud-direct-link-1-dedicated-hosting"
      text="Client Hooks"
      :description="`Total hooks: ${clientHooks.length}`"
      padding="pl4 pr6"
    >
      <HooksTable :hooks="clientHooks" />
    </NSectionBlock>
    <NSectionBlock
      v-if="serverHooks?.length"
      icon="carbon-ibm-cloud-direct-link-2-dedicated"
      text="Server Hooks"
      :description="`Total hooks: ${serverHooks?.length}`"
      padding="pl4 pr6"
    >
      <HooksTable :hooks="serverHooks" />
    </NSectionBlock>
  </div>

  <HelpFab>
    <DocsHooks />
  </HelpFab>
</template>
