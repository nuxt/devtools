<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

definePageMeta({
  icon: 'carbon-plug',
  display: 'Plugins',
})
</script>

<template>
  <div>
    Plugins
  </div>
</template>
