<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { Pane, Splitpanes } from 'splitpanes'
import { computed, ref } from 'vue'

import 'splitpanes/dist/splitpanes.css'

const props = withDefaults(defineProps<{
  /**
   * The key to use for storing the pane sizes in localStorage.
   */
  storageKey?: string
  stateKey?: string
  leftSize?: number
  minSize?: number
  horizontal?: boolean
}>(), {
  stateKey: 'nuxt-devtools-panels-state',
})

const state = useLocalStorage<Record<string, number>>(props.stateKey, {} as any, { listenToStorageChanges: false })

const DEFAULT = 30

const key = props.storageKey
const size = key
  ? computed({
    get: () => state.value[key] || props.leftSize || DEFAULT,
    set: (v) => { state.value[key] = v },
  })
  : ref(props.leftSize || DEFAULT)
</script>

<template>
  <Splitpanes :horizontal="horizontal" h-full of-hidden @resize="size = $event[0].size">
    <Pane h-full class="of-auto!" :size="size" :min-size="$slots.right ? (minSize || 10) : 100">
      <slot name="left" />
    </Pane>
    <Pane v-if="$slots.right" relative h-full class="of-auto!" :min-size="minSize || 10">
      <slot name="right" />
    </Pane>
  </Splitpanes>
</template>

<style>
.splitpanes__splitter {
  position: relative;
}
.splitpanes__splitter:before {
  position: absolute;
  left: 0;
  top: 0;
  transition: 0.2s ease;
  content: '';
  transition: opacity 0.4s;
  z-index: 1;
}
.splitpanes__splitter:hover:before {
  background: #8881;
  opacity: 1;
}
.splitpanes--vertical > .splitpanes__splitter {
  min-width: 0 !important;
  width: 0 !important;
  --at-apply: border-r border-base;
}
.splitpanes--horizontal > .splitpanes__splitter {
  min-height: 0 !important;
  height: 0 !important;
  --at-apply: border-t border-base;
}
.splitpanes--vertical > .splitpanes__splitter:before {
  left: -5px;
  right: -4px;
  height: 100%;
}
.splitpanes--horizontal > .splitpanes__splitter:before {
  top: -5px;
  bottom: -4px;
  width: 100%;
}
</style>
