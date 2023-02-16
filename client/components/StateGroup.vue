<script setup lang="ts">
import StateEditor from './StateEditor.vue'

withDefaults(
  defineProps<{
    state?: Record<string, any>
    prefix?: string
  }>(),
  {
    prefix: '',
  },
)
</script>

<template>
  <div>
    <template v-if="state && Object.keys(state).length > 0">
      <div v-for="value, key of state" :key="key">
        <details py2>
          <summary cursor-pointer select-none>
            <code font-mono px2>{{ key.startsWith(prefix) ? key.slice(prefix.length) : key }}</code>
          </summary>
          <StateEditor :state="value" mt-1 />
        </details>
      </div>
    </template>
    <div v-else italic op35 mt2>
      No data
    </div>
  </div>
</template>
