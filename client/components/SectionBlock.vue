<script setup lang="ts">
const {
  divider = true,
  padding = 'pl4',
} = defineProps<{
  icon?: string
  text: string
  divider?: boolean
  padding?: string
}>()
</script>

<template>
  <div v-if="divider" x-divider />
  <div p4 flex="~ col gap2">
    <IconTitle :icon="icon" :text="text" text-lg op50 />
    <slot name="description" />
    <div :class="padding" mt1>
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>
