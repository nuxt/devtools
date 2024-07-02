<script setup lang="ts">
withDefaults(
  defineProps<{
    state?: Record<string, any>
    revision?: number
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
        :revision="revision"
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
