<script setup lang="ts">
import { definePageMeta } from '#imports'
import ComponentsGraph from '~/components/ComponentsGraph.vue'
import ComponentsList from '~/components/ComponentsList.vue'
import { useClient } from '~/composables/client'
import { useComponents, useComponentsRelationships } from '~/composables/state-components'
import { useDevToolsOptions } from '../../composables/storage-options'

definePageMeta({
  icon: 'i-carbon-assembly-cluster',
  title: 'Components',
  order: 2,
})

const client = useClient()
const components = useComponents()
const relationships = useComponentsRelationships()

const { componentsView: view } = useDevToolsOptions('ui')

function openComponentInspector() {
  client.value?.inspector?.enable()
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
      :relationships="relationships"
    >
      <div flex-none flex="~ gap3">
        <NButton
          v-tooltip.bottom-end="'Toggle View'"
          text-lg :border="false"
          :icon="view === 'graph' ? 'i-carbon-list' : 'i-carbon-network-4'"
          title="Toggle view"
          @click="toggleView"
        />
        <NButton
          v-if="client?.inspector?.isAvailable"
          v-tooltip.bottom-end="'Inspect Vue components'"
          text-lg :border="false"
          icon="i-tabler-focus-2"
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
