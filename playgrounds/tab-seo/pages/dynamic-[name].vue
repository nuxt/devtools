<script setup lang="ts">
const route = useRoute()

const name = computed(() => route.params.name as string)
</script>

<template>
  <div>
    Dynamic, {{ name }}!
  </div>
</template>
