<script setup lang="ts">
import type { PluginInfoWithMetic } from '@nuxt/devtools-kit/types'

const props = defineProps<{
  plugin: PluginInfoWithMetic
  index?: number
}>()

const config = useServerConfig()
const shortPath = computed(() => parseReadablePath(props.plugin.src, config.value?.rootDir || '').path)
</script>

<template>
  <div flex="~ gap2" items-center>
    <div text-sm op25 text-right w8>
      {{ index }}
    </div>
    <FilepathItem :filepath="props.plugin.src" :subpath="true" />
    <div>
      <Badge
        v-if="shortPath.startsWith('#')"
        bg-rose-400:10 text-rose-400
        v-text="'virtual'"
      />
      <Badge
        v-else-if="!shortPath.startsWith('.')"
        bg-gray-400:10 text-gray-400
        v-text="'module'"
      />
      <Badge
        v-if="plugin.mode === 'server'"
        bg-teal-400:10 text-teal-400
        v-text="'server'"
      />
      <Badge
        v-if="plugin.mode === 'client'"
        bg-orange-400:10 text-orange-400
        v-text="'client'"
      />
    </div>
    <div v-if="plugin.metric?.duration != null" text-right flex-auto>
      <DurationDisplay :duration="plugin.metric?.duration" :factor="10" />
    </div>
  </div>
</template>
