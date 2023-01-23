<script setup lang="ts">
definePageMeta({
  icon: 'carbon-data-set',
  title: 'Payload',
  requireClient: true,
})

const client = useClient()
const payload = $computed(() => client.value?.nuxt.payload)
</script>

<template>
  <div v-if="client">
    <SectionBlock
      icon="carbon-data-set"
      text="State"
      description="Keyed state from `useState`"
    >
      <StateGroup pl2 :state="payload.state" prefix="$s" />
    </SectionBlock>
    <SectionBlock
      icon="carbon-data-blob"
      text="Data"
      description="Keyed state from `useAsyncData`"
    >
      <StateGroup pl2 :state="payload.data" />
    </SectionBlock>
    <SectionBlock
      v-if="payload.functions && Object.keys(payload.functions).length"
      icon="carbon-function"
      text="Functions"
      description="State for functions (experimental)"
    >
      <StateEditor pl2 :state="payload.functions" />
    </SectionBlock>
  </div>
</template>
