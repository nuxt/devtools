<script setup lang="ts">
import { Pinia } from '@vue/devtools-applet'
import { useDevToolsState as useVueDevToolsState } from '@vue/devtools-core'

const { connected } = useVueDevToolsState()

definePageMeta({
  icon: 'i-logos-pinia',
  title: 'Pinia',
  layout: 'full',
  show() {
    const configs = useServerConfig()
    return () => configs.value?.modules?.some(item => (item as string | Array<unknown>)?.includes('@pinia/nuxt'))
  },
})
</script>

<template>
  <div class="h-full w-full">
    <Pinia v-if="connected" />
    <NLoading v-else>
      Connecting....
    </NLoading>
  </div>
</template>
