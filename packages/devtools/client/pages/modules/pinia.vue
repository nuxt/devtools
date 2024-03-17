<script setup lang="ts">
import { Pinia } from '@vue/devtools-applet'
import '@vue/devtools-applet/style.css'

definePageMeta({
  icon: 'i-logos-pinia',
  title: 'Pinia',
  layout: 'full',
})
</script>

<template>
  <div class="h-full w-full">
    <Pinia />
  </div>
</template>
