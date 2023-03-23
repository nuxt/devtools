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
    <div v-if="state && Object.keys(state).length > 0" flex="~ col gap-1">
      <StateEditor
        v-for="value, key of state"
        :key="key"
        :state="value"
        :name="key.startsWith(prefix) ? key.slice(prefix.length) : key"
      >
        <template #actions="props">
          <slot name="actions" v-bind="props" />
        </template>
      </StateEditor>
    </div>
    <div v-else italic px4 op35 mt2>
      No data
    </div>
  </div>
</template>
