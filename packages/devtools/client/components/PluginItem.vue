<script setup lang="ts">
import type { PluginInfoWithMetic } from '@nuxt/devtools-kit/types'
import { computed } from 'vue'
import { useServerConfig } from '~/composables/state'
import { parseReadablePath } from '~/composables/utils'

const props = defineProps<{
  plugin: PluginInfoWithMetic
  index?: number
}>()

const config = useServerConfig()
const shortPath = computed(() => parseReadablePath(props.plugin.src, config.value?.rootDir || '').path)
</script>

<template>
  <div flex="~ gap2" items-center>
    <div w8 text-right text-sm op25>
      {{ index }}
    </div>
    <FilepathItem :filepath="props.plugin.src" :subpath="true" />
    <div>
      <NBadge
        v-if="shortPath.startsWith('#')"
        n="rose"
        v-text="'virtual'"
      />
      <NBadge
        v-else-if="!shortPath.startsWith('.')"
        n="gray"
        v-text="'module'"
      />
      <NBadge
        v-if="plugin.mode === 'server'"
        n="teal"
        v-text="'server'"
      />
      <NBadge
        v-if="plugin.mode === 'client'"
        n="orange"
        v-text="'client'"
      />
    </div>
    <div v-if="plugin.metric?.duration != null" flex-auto text-right>
      <DurationDisplay :duration="plugin.metric?.duration" :factor="10" />
    </div>
  </div>
</template>
