<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import type { NuxtDevtoolsHostClient } from '../../../types'
import { state } from './state'
import Frame from './Frame.vue'
import Floating from './Floating.vue'
import { useClientColorMode } from './dark'

defineProps({
  client: Object as PropType<NuxtDevtoolsHostClient>,
})

const initialized = ref(state.value.open)
if (!initialized.value) {
  watch(() => state.value.open, (open) => {
    if (open)
      initialized.value = open
  })
}

const clientColorMode = useClientColorMode()

const vars = computed(() => {
  const dark = clientColorMode.value === 'dark'
  return {
    '--nuxt-devtools-widget-bg': dark ? '#0C0C0C' : '#ffffff',
    '--nuxt-devtools-widget-fg': dark ? '#F5F5F5' : '#0C0C0C',
    '--nuxt-devtools-widget-border': dark ? '#0C0C0C' : '#efefef',
    '--nuxt-devtools-widget-shadow': dark ? 'rgba(0,0,0,0.3)' : 'rgba(128,128,128,0.1)',
  }
})
</script>

<template>
  <div :style="vars">
    <Frame v-if="initialized" :client="client" />
    <Floating />
    <!-- <ToggleButton /> -->
  </div>
</template>
