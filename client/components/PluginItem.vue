<script setup lang="ts">
import type { NuxtPlugin } from '@nuxt/schema'

const props = defineProps<{
  plugin: any
  index?: number
}>()

const normalized = $computed((): NuxtPlugin => {
  if (typeof props.plugin === 'string')
    return { src: props.plugin }
  return props.plugin
})

const shortPath = $computed(() => getShortPath(normalized.src, config.rootDir, true)!)
</script>

<template>
  <div flex="~ gap2" items-center>
    <div op25 w8 text-right text-sm>
      {{ index }}
    </div>
    <button hover:underline :class="shortPath.startsWith('.') ? '' : 'op50'" @click="openInEditor(normalized.src)">
      <code font-mono text-sm>{{ shortPath }}</code>
    </button>
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
        v-if="normalized.mode === 'server'"
        bg-teal-400:10 text-teal-400
        v-text="'server'"
      />
      <Badge
        v-if="normalized.mode === 'client'"
        bg-orange-400:10 text-orange-400
        v-text="'client'"
      />
    </div>
  </div>
</template>
