<script setup lang="ts">
import StateEditor from './StateEditor.vue'

defineProps<{
  state: Record<string, any>
}>()
</script>

<template>
  <div>
    <div v-for="value, key of state" :key="key">
      <details py2>
        <summary cursor-pointer select-none>
          <code font-mono px2>{{ key }}</code>
        </summary>
        <StateEditor :state="value" mt-1 />
      </details>
    </div>
  </div>
</template>
