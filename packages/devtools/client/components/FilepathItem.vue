<script setup lang="ts">
const props = defineProps<{
  filepath: string
  lineBreak?: boolean
}>()

const config = useServerConfig()
const short = computed(() => (props.filepath && config.value)
  ? getShortPath(props.filepath, config.value.rootDir)
  : props.filepath,
)
</script>

<template>
  <button
    font-mono hover:underline
    :class="lineBreak ? '' : 'ws-nowrap of-hidden truncate'"
    :title="filepath"
    @click="openInEditor(filepath)"
  >
    {{ short }}
  </button>
</template>
