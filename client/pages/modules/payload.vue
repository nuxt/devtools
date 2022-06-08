<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

definePageMeta({
  icon: 'carbon-data-set',
  display: 'Payload',
})

const payload = await rpc.getPayload()
</script>

<template>
  <div>
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
    <template v-if="payload.functions && Object.keys(payload.functions).length">
      <div x-divider />
      <div p4 flex="~ col gap2">
        <IconTitle icon="carbon-function" text="Functions" text-lg op50 />
        <StateGroup pl2 :state="payload.functions" />
      </div>
    </template>
  </div>
</template>
