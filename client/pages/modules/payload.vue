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
      v-if="payload.state && Object.keys(payload.state).length"
      icon="carbon-data-set"
      text="State"
    >
      <StateGroup pl2 :state="payload.state" prefix="$s" />
    </SectionBlock>
    <SectionBlock
      v-if="payload.data && Object.keys(payload.data).length"
      icon="carbon-data-blob"
      text="Data"
    >
      <StateGroup pl2 :state="payload.data" />
    </SectionBlock>

    <SectionBlock
      v-if="payload.functions && Object.keys(payload.functions).length"
      icon="carbon-function"
      text="Functions"
    >
      <StateEditor pl2 :state="payload.functions" />
    </SectionBlock>
  </div>
</template>
