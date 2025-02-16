<script setup lang="ts">
import { definePageMeta } from '#imports'
import { Pinia } from '@vue/devtools-applet'
import { useModuleOptions, useServerConfig } from '~/composables/state'
import { useVueDevToolsState } from '~/setup/vue-devtools'

definePageMeta({
  icon: 'i-logos-pinia',
  title: 'Pinia',
  layout: 'full',
  category: 'vue-devtools',
  show() {
    const configs = useServerConfig()
    const options = useModuleOptions()
    return () => options.value?.vueDevTools !== false && configs.value?.modules?.some(item => (item as string | Array<unknown>)?.includes('@pinia/nuxt'))
  },
})

const { connected } = useVueDevToolsState()
</script>

<template>
  <div class="h-full w-full">
    <Pinia v-if="connected" />
    <NLoading v-else>
      Connecting....
    </NLoading>
  </div>
</template>
