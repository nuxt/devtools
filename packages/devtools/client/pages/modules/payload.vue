<script setup lang="ts">
definePageMeta({
  icon: 'carbon-data-set',
  title: 'Payload',
  requireClient: true,
  order: 7,
})

const client = useClient()
const payload = computed(() => client.value?.nuxt.payload)
</script>

<template>
  <div v-if="client">
    <NSectionBlock
      icon="carbon-data-set"
      text="State"
      description="Keyed state from `useState`"
      :padding="false"
    >
      <StateGroup
        :state="payload.state" prefix="$s"
      />
    </NSectionBlock>
    <NSectionBlock
      icon="carbon-data-blob"
      text="Data"
      description="Keyed state from `useAsyncData`"
      :padding="false"
    >
      <StateGroup
        :state="payload.data"
      />
    </NSectionBlock>
    <NSectionBlock
      v-if="payload.functions && Object.keys(payload.functions).length"
      icon="carbon-function"
      text="Functions"
      description="State for functions (experimental)"
    >
      <StateEditor
        ml--6
        :state="payload.functions"
      />
    </NSectionBlock>
  </div>
</template>
