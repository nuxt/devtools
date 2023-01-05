<script setup lang="ts">
definePageMeta({
  icon: 'carbon-ibm-cloud-direct-link-2-connect',
  title: 'Hooks',
})

const serverHooks = await rpc.getServerHooks()
</script>

<template>
  <div>
    <SectionBlock
      icon="carbon-plug"
      text="Server Hooks"
      :description="`Total hooks: ${serverHooks.length}`"
    >
      <HooksTable :hooks="serverHooks" />
    </SectionBlock>
  </div>
</template>
