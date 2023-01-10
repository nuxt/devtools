<script setup lang="ts">
import StateEditor from './StateEditor.vue'

const { prefix = '' } = defineProps<{
  state: Record<string, any>
  prefix?: string
}>()
</script>

<template>
  <div>
    <div v-for="value, key of state" :key="key">
      <details py2>
        <summary cursor-pointer select-none>
          <code font-mono px2>{{ key.startsWith(prefix) ? key.slice(prefix.length) : key }}</code>
        </summary>
        <StateEditor :state="value" mt-1 />
      </details>
    </div>
  </div>
</template>
