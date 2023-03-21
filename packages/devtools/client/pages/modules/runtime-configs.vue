<script setup lang="ts">
definePageMeta({
  icon: 'carbon-settings-services',
  title: 'Runtime Configs',
  requireClient: true,
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
    >
      <StateEditor
        ml--6
        :state="client.appConfig"
      />
    </NSectionBlock>

    <NSectionBlock
      icon="carbon-settings"
      text="Public Runtime Config"
    >
      <StateEditor
        ml--6
        :state="payload.config?.public"
      />
    </NSectionBlock>

    <NSectionBlock
      icon="i-carbon-code-signing-service"
      :open="false"
      text="Private Runtime Config"
      description="These values are not exposed to the client. Readonly in the DevTools."
    >
      <StateEditor
        ml--6
        :state="privateConfig"
        readonly
      />
    </NSectionBlock>
  </div>
</template>
