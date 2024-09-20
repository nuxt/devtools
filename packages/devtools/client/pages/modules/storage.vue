<script setup lang="ts">
import { definePageMeta } from '#imports'

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
