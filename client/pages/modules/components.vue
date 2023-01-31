<script setup lang="ts">
import type { Component } from '@nuxt/schema'

definePageMeta({
  icon: 'carbon-nominal',
  title: 'Components',
  order: 2,
})

const client = useClient()
const router = useRouter()
const serverComponents = await rpc.getComponents()

const globalComponents = $computed(() =>
  Object
    .entries(client.value?.nuxt?.vueApp._context.components || {})
    .map(([key]) => ({
      pascalName: key,
      global: true,
    } as unknown as Component))
    // dedupe server components
    .filter(i => !serverComponents.find(j => j.pascalName === i.pascalName)),
)

const components = $computed(() => [
  ...globalComponents,
  ...serverComponents,
].sort((a, b) => a.pascalName.localeCompare(b.pascalName)))

const search = $ref('')

const {
  componentsView: view,
} = devToolsSettingsRefs

function openComponentInspector() {
  if (!client.value?.inspector?.instance)
    return
  client.value.inspector.enable()
  router.push('/__inspecting')
}

function toggleView() {
  view.value = view.value === 'list' ? 'graph' : 'list'
}
</script>

<template>
  <div h-full of-auto>
    <div p4 flex="~ gap4" flex-1 border="b base" navbar-glass>
      <NTextInput
        v-model="search"
        placeholder="Search..."
        icon="carbon-search"
        p="x5 y2"
        n="primary"
        flex-auto bg-base border-base
      />
      <button
        title="Toggle view"
        @click="toggleView"
      >
        <NIcon v-if="view === 'graph'" icon="i-carbon-network-4" />
        <NIcon v-else icon="i-carbon-list" />
      </button>
      <button
        v-if="client?.inspector?.instance"
        title="Inspect Vue components"
        @click="openComponentInspector"
      >
        <NIcon icon="i-carbon-select-window" />
      </button>
    </div>
    <ComponentsGraph v-if="view === 'graph'" :components="components" />
    <ComponentsList v-else :search="search" :components="components" />
  </div>
</template>
