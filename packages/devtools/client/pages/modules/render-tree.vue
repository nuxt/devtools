<script setup lang="ts">
import { definePageMeta } from '#imports'
import { Components as VueComponents } from '@vue/devtools-applet'
import { useClient } from '~/composables/client'
import { useOpenInEditor } from '~/composables/editor'
import { useModuleOptions } from '~/composables/state'
import { useVueDevToolsState } from '~/setup/vue-devtools'

definePageMeta({
  icon: 'i-carbon-category',
  title: 'Render Tree',
  layout: 'full',
  show: () => {
    const client = useClient()
    const options = useModuleOptions()
    return () => options.value?.vueDevTools !== false && !!client.value
  },
  order: 1,
  category: 'vue-devtools',
})

const { connected } = useVueDevToolsState()
const client = useClient()
const openInEditor = useOpenInEditor()

function togglePanel(status: boolean) {
  if (status)
    client.value.devtools.open()
  else
    client.value.devtools.close()
}
</script>

<template>
  <div class="h-full w-full">
    <VueComponents
      v-if="connected"
      @on-inspect-component-start="togglePanel(false)"
      @on-inspect-component-end="togglePanel(true)"
      @open-in-editor="openInEditor"
    />
    <NLoading v-else>
      Connecting....
    </NLoading>
  </div>
</template>
