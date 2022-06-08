<script setup lang="ts">
import type { Component } from '@nuxt/schema'
import { relative } from 'pathe'
import { openInEditor } from '#imports'

const { component } = defineProps<{
  component: Component
}>()

const config = await useConfig()
const path = computed(() => {
  const path = relative(config.rootDir, component.filePath)
  if (!path.startsWith('.'))
    return `./${path}`
  return path
})

const clipboard = useClipboard()
const showNotification = useNotification()

function copy() {
  // TODO: support config cases
  clipboard.copy(`<${component.pascalName}><${component.pascalName}/>`)
  showNotification('Copied to clipboard', 'carbon-checkmark')
}
</script>

<template>
  <div rounded px2 py1 hover="bg-gray/10" class="group" flex="~ gap2" w-full>
    <button @click="copy()">
      <code text-sm><span op20 mr1>&lt;</span>{{ component.pascalName }}<span op20 ml1>/&gt;</span></code>
    </button>
    <button text-sm op0 group-hover:op50 hover:underline @click="openInEditor(component.filePath)">
      {{ path }}
    </button>
  </div>
</template>
