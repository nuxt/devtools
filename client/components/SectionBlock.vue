<script setup lang="ts">
const { divider = true } = defineProps<{
  icon?: string
  text: string
  divider?: boolean
}>()
</script>

<template>
  <div v-if="divider" x-divider />
  <div p4 flex="~ col gap2">
    <IconTitle :icon="icon" :text="text" text-lg op50 />
    <div pl4>
      <slot />
    </div>
  </div>
</template>
