<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

definePageMeta({
  icon: 'carbon-data-set',
  display: 'State',
})
</script>

<template>
  <div>
    State
  </div>
</template>
