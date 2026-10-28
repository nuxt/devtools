<script setup lang="ts">
const props = defineProps<{ price: number }>()
const { public: { currency } } = useRuntimeConfig()
const formatted = computed(() => new Intl.NumberFormat('en', { style: 'currency', currency }).format(props.price))
</script>

<template>
  <span font-mono>{{ formatted }}</span>
</template>
