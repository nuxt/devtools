<script setup lang="ts">
definePageMeta({
  icon: 'carbon-settings-services',
  title: 'Runtime Configs',
  category: 'analyze',
  show: () => {
    const client = useClient()
    return () => !!client.value
  },
  order: 6,
})

const client = useClient()
const runtimeConfig = useServerRuntimeConfig()
const payload = computed(() => client.value?.nuxt.payload)

const privateConfig = computed(() => {
  const clone = {
    ...runtimeConfig.value,
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
      <StateEditor :state="toRef(client.app.appConfig)" />
    </NSectionBlock>

    <NSectionBlock
      icon="carbon-settings"
      text="Public Runtime Config"
      :padding="false"
    >
      <StateEditor :state="toRef(payload.config?.public)" />
    </NSectionBlock>

    <NSectionBlock
      icon="i-carbon-code-signing-service"
      text="Private Runtime Config"
      :open="false"
      :padding="false"
      description="These values are not exposed to the client. Readonly in the DevTools."
    >
      <StateEditor :state="toRef(privateConfig)" readonly />
    </NSectionBlock>
  </div>

  <HelpFab>
    <DocsRuntimeConfigs />
  </HelpFab>
</template>
