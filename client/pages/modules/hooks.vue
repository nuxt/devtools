<script setup lang="ts">
definePageMeta({
  icon: 'carbon-ibm-cloud-direct-link-2-connect',
  title: 'Hooks',
})

const serverHooks = useServerHooks()
const client = useClient()
const clientHooks = computed(() => client.value?.getHooksMetrics())
</script>

<template>
  <div>
    <SectionBlock
      v-if="clientHooks?.length"
      icon="carbon-ibm-cloud-direct-link-1-dedicated-hosting"
      text="Client Hooks"
      :description="`Total hooks: ${clientHooks.length}`"
      padding="pl4 pr6"
    >
      <HooksTable :hooks="clientHooks" />
    </SectionBlock>
    <SectionBlock
      icon="carbon-ibm-cloud-direct-link-2-dedicated"
      text="Server Hooks"
      :description="`Total hooks: ${serverHooks.length}`"
      padding="pl4 pr6"
    >
      <HooksTable :hooks="serverHooks" />
    </SectionBlock>
  </div>
</template>
