<script setup lang="ts">
import type { Component } from '@nuxt/schema'
import { openInEditor } from '#imports'

const { component } = defineProps<{
  component: Component
}>()

const path = $computed(() => getShortPath(component.filePath, config.rootDir))
const copy = useCopy()
</script>

<template>
  <div rounded px2 py1 hover="bg-gray/10" class="group" flex="~ gap2" w-full>
    <button hover:text-primary @click="copy(`<${component.pascalName}></${component.pascalName}>`)">
      <code font-mono text-sm><span op20 mr1>&lt;</span>{{ component.pascalName }}<span op20 ml1>/&gt;</span></code>
    </button>
    <button text-sm op0 group-hover:op50 hover:underline @click="openInEditor(component.filePath)">
      {{ path }}
    </button>
  </div>
</template>
