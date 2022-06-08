<script setup lang="ts">
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
        <div py2 pl4 text-sm>
          <pre bg-gray:10 p2 rounded of-auto>{{ value === undefined ? 'undefined' : value === null ? 'null' : value }}</pre>
        </div>
      </details>
    </div>
  </div>
</template>
