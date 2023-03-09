<script setup lang="ts">
import { useComponents } from '~/composables/state'
import ComponentsGraph from '~/components/ComponentsGraph.vue'
import ComponentsList from '~/components/ComponentsList.vue'

definePageMeta({
  icon: 'i-carbon-assembly-cluster',
  title: 'Components',
  order: 2,
})

const client = useClient()
const router = useRouter()
const components = useComponents()

const {
  componentsView: view,
} = useDevToolsSettings()

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
  <div h-full of-auto relative>
    <component
      :is="view === 'list' ? ComponentsList : ComponentsGraph"
      :components="components"
    >
      <div flex-none flex="~ gap4">
        <button
          title="Toggle view"
          @click="toggleView"
        >
          <NIcon v-if="view === 'graph'" icon="i-carbon-list" />
          <NIcon v-else icon="i-carbon-network-4" />
        </button>
        <button
          v-if="client?.inspector?.instance"
          title="Inspect Vue components"
          @click="openComponentInspector"
        >
          <NIcon icon="i-carbon-select-window" />
        </button>
      </div>
    </component>
  </div>
</template>
