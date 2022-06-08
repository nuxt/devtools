<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

definePageMeta({
  icon: 'carbon-cloud',
  display: 'Server Routes',
})
</script>

<template>
  <div>
    Server Routes
  </div>
</template>
