<script setup lang="ts">
definePageMeta({
  icon: 'carbon-data-set',
  title: 'Payload',
  category: 'analyze',
  show: () => {
    const client = useClient()
    return () => !!client.value
  },
  order: 7,
})

const client = useClient()
const payload = computed(() => client.value?.nuxt.payload)
const revision = computed(() => client.value?.revision.value)

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
        :state="payload.state"
        :revision="revision"
        prefix="$s"
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
      <StateGroup
        :state="payload.data"
        :revision="revision"
      >
        <template #actions="{ isOpen, name }">
          <NButton
            v-if="isOpen && name"
            v-tooltip.bottom="`Re-fetch '${name}'`"
            :title="`Re-fetch '${name}'`"
            icon="carbon-recycle"
            :border="false"
            @click="refreshData([name])"
          />
        </template>
      </StateGroup>
    </NSectionBlock>
    <NSectionBlock
      v-if="payload.functions && Object.keys(payload.functions).length"
      icon="carbon-function"
      text="Functions"
      description="State for functions"
    >
      <StateEditor
        ml--6
        :state="payload.functions"
        :revision="revision"
      />
    </NSectionBlock>
  </div>

  <HelpFab>
    <DocsPayload />
  </HelpFab>
</template>
