<script setup lang="ts">
definePageMeta({
  icon: 'carbon-data-base',
  title: 'Storage',
  layout: 'full',
  category: 'server',
})
</script>

<template>
  <AuthRequiredPanel>
    <StorageDetails />
  </AuthRequiredPanel>
</template>
