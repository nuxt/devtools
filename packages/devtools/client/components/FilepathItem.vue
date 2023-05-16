<script setup lang="ts">
const props = defineProps<{
  filepath?: string
  lineBreak?: boolean
  subpath?: boolean
  override?: string
}>()

const openInEditor = useOpenInEditor()
const config = useServerConfig()
const parsed = computed(() => (props.filepath && config.value)
  ? parseReadablePath(props.filepath, config.value.rootDir)
  : { path: props.filepath || '' },
)
</script>

<template>
  <component
    :is="filepath ? 'button' : 'span'"
    :class="[
      filepath ? 'hover:underline' : '',
      lineBreak ? '' : 'ws-nowrap of-hidden truncate',
    ]"
    font-mono
    :title="override || filepath"
    @click="filepath && openInEditor(filepath)"
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
  </component>
</template>
