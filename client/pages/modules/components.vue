<script setup lang="ts">
import { useComponents } from '~/composables/state'

definePageMeta({
  icon: 'carbon-nominal',
  title: 'Components',
  order: 2,
})

const client = useClient()
const router = useRouter()
const components = useComponents()
const search = ref('')

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
