<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

definePageMeta({
  icon: 'carbon-3d-mpr-toggle',
  display: 'Modules',
})
</script>

<template>
  <div>
    Modules
  </div>
</template>
