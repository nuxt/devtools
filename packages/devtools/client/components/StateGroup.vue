<script setup lang="ts">
import type { ToRefs } from 'vue'

const props = withDefaults(
  defineProps<{
    state?: Record<string, any>
    prefix?: string
  }>(),
  {
    prefix: '',
  },
)

let stateRefs: ToRefs<typeof props.state>
if (props.state)
  stateRefs = toRefs(props.state)
</script>

<template>
  <div>
    <div v-if="stateRefs && state && Object.keys(state).length > 0" flex="~ col gap-1">
      <StateEditor
        v-for="(value, key) of stateRefs"
        :key="key"
        :state="value"
        :name="key.startsWith(prefix) ? key.slice(prefix.length) : key"
      >
        <template #actions="props">
          <slot name="actions" v-bind="props" />
        </template>
      </StateEditor>
    </div>
    <div v-else mt2 px4 italic op35>
      No data
    </div>
  </div>
</template>
