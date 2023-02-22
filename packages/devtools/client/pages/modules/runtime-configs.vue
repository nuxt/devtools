<script setup lang="ts">
definePageMeta({
  icon: 'carbon-settings',
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
    <SectionBlock
      icon="carbon-settings-services"
      text="App Config"
    >
      <StateEditor
        ml--6
        :state="client.appConfig"
      />
    </SectionBlock>

    <SectionBlock
      icon="carbon-settings"
      text="Public Runtime Config"
    >
      <StateEditor
        ml--6
        :state="payload.config?.public"
      />
    </SectionBlock>

    <SectionBlock
      icon="carbon-locked"
      :open="false"
      text="Private Runtime Config"
      description="These values are not exposed to the client. Readonly in the DevTools."
    >
      <StateEditor
        ml--6
        :state="privateConfig"
        readonly
      />
    </SectionBlock>
  </div>
</template>
