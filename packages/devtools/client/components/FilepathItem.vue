<script setup lang="ts">
import { computed } from 'vue'
import { useCopy, useOpenInEditor } from '~/composables/editor'
import { useServerConfig } from '~/composables/state'
import { parseReadablePath } from '~/composables/utils'

const props = defineProps<{
  filepath?: string
  lineBreak?: boolean
  subpath?: boolean
  override?: string
}>()

const openInEditor = useOpenInEditor()
const copy = useCopy()
const config = useServerConfig()
const parsed = computed(() => (props.filepath && config.value)
  ? parseReadablePath(props.filepath, config.value.rootDir)
  : { path: props.filepath || '' })
</script>

<template>
  <span flex="~ gap-2 items-center" class="group">
    <span
      :class="[
        lineBreak ? '' : 'ws-nowrap of-hidden truncate',
      ]"
      font-mono
      :title="override || filepath"
    >
      <template v-if="override">
        {{ override }}
      </template>
      <template v-else-if="parsed.moduleName">
        <span>{{ parsed.moduleName }}</span>
        <span v-if="subpath" op50>
          {{ parsed.path.slice(parsed.moduleName.length) }}
        </span>
      </template>
      <template v-else>
        {{ parsed.path }}
      </template>
    </span>
    <slot />
    <div v-if="filepath" flex="~ gap1" pr2 op0 group-hover:op100>
      <button
        text-sm op40 hover="op100 text-primary"
        title="Open in editor"
        @click="openInEditor(filepath)"
      >
        <div i-carbon-script-reference />
      </button>
      <button
        text-sm op40 hover="op100 text-primary"
        title="Copy path"
        @click="copy(filepath)"
      >
        <div i-carbon-copy />
      </button>
    </div>
  </span>
</template>
