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
    <template v-if="payload.state && Object.keys(payload.state).length">
      <div p4 flex="~ col gap2">
        <IconTitle icon="carbon-data-set" text="State" text-lg op50 />
        <StateGroup pl2 :state="payload.state" />
      </div>
    </template>
    <template v-if="payload.data && Object.keys(payload.data).length">
      <div x-divider />
      <div p4 flex="~ col gap2">
        <IconTitle icon="carbon-data-blob" text="Data" text-lg op50 />
        <StateGroup pl2 :state="payload.data" />
      </div>
    </template>
    <template v-if="payload.config?.app && Object.keys(payload.config?.app).length">
      <div x-divider />
      <div p4 flex="~ col gap2">
        <IconTitle icon="carbon-settings" text="App Config" text-lg op50 />
        <StateEditor pl2 :state="payload.config?.app" />
      </div>
    </template>
    <template v-if="payload.config?.public && Object.keys(payload.config?.public).length">
      <div x-divider />
      <div p4 flex="~ col gap2">
        <IconTitle icon="carbon-settings" text="Runtime Config" text-lg op50 />
        <StateEditor pl2 :state="payload.config?.public" />
      </div>
    </template>
    <template v-if="payload.functions && Object.keys(payload.functions).length">
      <div x-divider />
      <div p4 flex="~ col gap2">
        <IconTitle icon="carbon-function" text="Functions" text-lg op50 />
        <StateEditor pl2 :state="payload.functions" />
      </div>
    </template>
  </div>
</template>
