<script setup lang="ts">
definePageMeta({
  icon: 'carbon-data-set',
  title: 'Payload',
  requireClient: true,
  order: 7,
})

const client = useClient()
const payload = computed(() => client.value?.nuxt.payload)

async function refreshData(keys?: string[]) {
  await client.value?.nuxt.hooks.callHookParallel('app:data:refresh', keys)
}
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
      <template #actions>
        <NButton
          n="xs primary" self-start
          icon="i-carbon-recycle"
          @click="refreshData()"
        >
          Re-fetch all data
        </NButton>
      </template>
      <StateGroup :state="payload.data">
        <template #actions="{ isOpen, name }">
          <NIconButton
            v-if="isOpen && name"
            :title="`Re-fetch '${name}'`"
            icon="carbon-recycle"
            @click="refreshData([name])"
          />
        </template>
      </StateGroup>
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
