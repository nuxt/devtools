<script setup lang="ts">
const {
  divider = true,
  containerClass = '',
} = defineProps<{
  icon?: string
  text: string
  description?: string
  divider?: boolean
  containerClass?: string
}>()
</script>

<template>
  <div v-if="divider" x-divider />
  <div p4 flex="~ col gap2">
    <IconTitle :icon="icon" :text="text" text-xl op75>
      <div>
        {{ text }}
        <div v-if="description" op50 text-sm>
          {{ description }}
        </div>
      </div>
    </IconTitle>
    <slot name="details" />
    <div :class="containerClass" mt1>
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>
