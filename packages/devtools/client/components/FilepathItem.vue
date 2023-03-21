<script setup lang="ts">
const props = defineProps<{
  filepath: string
  lineBreak?: boolean
  subpath?: boolean
}>()

const config = useServerConfig()
const parsed = computed(() => (props.filepath && config.value)
  ? parseReadablePath(props.filepath, config.value.rootDir)
  : { path: props.filepath },
)
</script>

<template>
  <button
    font-mono hover:underline
    :class="lineBreak ? '' : 'ws-nowrap of-hidden truncate'"
    :title="filepath"
    @click="openInEditor(filepath)"
  >
    <template v-if="parsed.moduleName">
      <span>{{ parsed.moduleName }}</span>
      <span v-if="subpath" op50>
        {{ parsed.path.slice(parsed.moduleName.length) }}
      </span>
    </template>
    <template v-else>
      {{ parsed.path }}
    </template>
  </button>
</template>
