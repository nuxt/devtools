<script setup lang="ts">
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
        <StateEditor
          :state="value"
          :name="key.startsWith(prefix) ? key.slice(prefix.length) : key"
        />
      </div>
    </template>
    <div v-else italic op35 mt2 px4>
      No data
    </div>
  </div>
</template>
