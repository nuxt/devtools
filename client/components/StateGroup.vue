<script setup lang="ts">
import { highlight } from '#imports'

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
        <div
          text-sm
          ml4
          my2
          border="~ base rounded"
          of-auto
          font-mono
          v-html="highlight(value === undefined ? 'undefined' : value === null ? 'null' : JSON.stringify(value, null, 2), 'javascript')"
        />
      </details>
    </div>
  </div>
</template>

<style>
.shiki {
  padding: 0.5rem;
}
pre, code {
  @apply !font-mono;
}
</style>
