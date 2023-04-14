<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const props = withDefaults(defineProps<{
  /**
   * The key to use for storing the pane sizes in localStorage.
   */
  storageKey?: string
  default?: number
  minSizeLeft?: number
  minSizeRight?: number
}>(), {
  default: 30,
  minSizeLeft: 10,
  minSizeRight: 10,
})

const state = useDevToolsPanelsState()
const key = props.storageKey
const size = key
  ? computed({
    get: () => state.value[key] || props.default,
    set: (v) => { state.value[key] = v },
  })
  : ref(props.default)
</script>

<template>
  <Splitpanes h-full of-hidden @resize="size = $event[0].size">
    <Pane border="r base" h-full class="of-auto!" :size="size" :min-size="minSizeLeft">
      <slot name="left" />
    </Pane>
    <Pane relative h-full class="of-auto!" :min-size="minSizeRight">
      <slot name="right" />
    </Pane>
  </Splitpanes>
</template>
