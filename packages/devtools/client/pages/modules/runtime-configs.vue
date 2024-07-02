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
const revision = computed(() => client.value?.revision.value)

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
      <StateEditor
        :state="client.app.appConfig"
        :revision="revision"
      />
    </NSectionBlock>

    <NSectionBlock
      icon="carbon-settings"
      text="Public Runtime Config"
      :padding="false"
    >
      <StateEditor
        :state="payload.config?.public"
        :revision="revision"
      />
    </NSectionBlock>

    <NSectionBlock
      icon="i-carbon-code-signing-service"
      text="Private Runtime Config"
      :open="false"
      :padding="false"
      description="These values are not exposed to the client. Readonly in the DevTools."
    >
      <StateEditor
        :state="privateConfig"
        :revision="revision"
        readonly
      />
    </NSectionBlock>
  </div>

  <HelpFab>
    <DocsRuntimeConfigs />
  </HelpFab>
</template>
