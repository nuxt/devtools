<script setup lang="ts">
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
} = useDevToolsOptions()

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
  <div relative h-full of-auto>
    <component
      :is="view === 'list' ? ComponentsList : ComponentsGraph"
      :components="components"
    >
      <div flex-none flex="~ gap3">
        <NIconButton
          text-lg
          :icon="view === 'graph' ? 'i-carbon-list' : 'i-carbon-network-4'"
          title="Toggle view"
          @click="toggleView"
        />
        <NIconButton
          v-if="client?.inspector?.instance"
          text-lg
          icon="i-carbon-select-window"
          title="Inspect Vue components"
          @click="openComponentInspector"
        />
      </div>
    </component>
  </div>

  <HelpFab>
    <DocsComponents />
  </HelpFab>
</template>
