<script setup lang="ts">
const { count } = useCart()
</script>

<template>
  <span text-sm>Cart ({{ count }})</span>
</template>
