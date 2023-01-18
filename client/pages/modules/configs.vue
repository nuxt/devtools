<script setup lang="ts">
definePageMeta({
  icon: 'carbon-data-set',
  title: 'Configs',
  requireClient: true,
})

const client = useClient()
const serverConfig = $(useServerConfig())
const payload = $computed(() => client.value?.nuxt.payload)

const privateConfig = $computed(() => {
  const clone = {
    ...serverConfig?.runtimeConfig,
  }
  delete clone.public
  delete clone.app
  return clone
})
</script>

<template>
  <div v-if="client">
    <SectionBlock
      v-if="client.appConfig && Object.keys(client.appConfig).length"
      icon="carbon-settings-services"
      text="App Config"
    >
      <StateEditor pl2 :state="client.appConfig" />
    </SectionBlock>

    <SectionBlock
      v-if="payload.config?.public && Object.keys(payload.config?.public).length"
      icon="carbon-settings"
      text="Public Runtime Config"
    >
      <StateEditor pl2 :state="payload.config?.public" />
    </SectionBlock>

    <SectionBlock
      v-if="privateConfig && Object.keys(privateConfig).length"
      icon="carbon-locked"
      :open="false"
      text="Private Runtime Config"
      description="These values are not exposed to the client. Readonly in the DevTools."
    >
      <StateEditor
        pl2 :state="privateConfig"
        readonly
      />
    </SectionBlock>
  </div>
</template>
