<script setup lang="ts">
definePageMeta({
  icon: 'carbon-settings-services',
  title: 'Runtime Configs',
  category: 'analyze',
  show: () => !!useClient().value,
  order: 6,
})

const client = useClient()
const serverConfig = useServerConfig()
const payload = computed(() => client.value?.nuxt.payload)

const privateConfig = computed(() => {
  const clone = {
    ...serverConfig.value?.runtimeConfig,
  }
  delete clone.public
  delete clone.app
  return clone
})
</script>

<template>
  <div v-if="client">
    <NSectionBlock
      icon="carbon-settings-services"
      text="App Config"
      :padding="false"
    >
      <StateEditor :state="client.appConfig" />
    </NSectionBlock>

    <NSectionBlock
      icon="carbon-settings"
      text="Public Runtime Config"
      :padding="false"
    >
      <StateEditor :state="payload.config?.public" />
    </NSectionBlock>

    <NSectionBlock
      icon="i-carbon-code-signing-service"
      text="Private Runtime Config"
      :open="false"
      :padding="false"
      description="These values are not exposed to the client. Readonly in the DevTools."
    >
      <StateEditor :state="privateConfig" readonly />
    </NSectionBlock>
  </div>

  <HelpFab>
    <DocsRuntimeConfigs />
  </HelpFab>
</template>
