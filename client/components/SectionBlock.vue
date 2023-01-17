<script setup lang="ts">
const {
  containerClass = '',
  open = true,
} = defineProps<{
  icon?: string
  text: string
  description?: string
  containerClass?: string
  open?: boolean
}>()
</script>

<template>
  <details p4 :open="open">
    <summary>
      <IconTitle :icon="icon" :text="text" text-xl op75>
        <div>
          {{ text }}
          <div v-if="description" op50 text-sm>
            {{ description }}
          </div>
        </div>
      </IconTitle>
    </summary>
    <div flex="~ col gap2" py2>
      <slot name="details" />
      <div :class="containerClass" mt1>
        <slot />
      </div>
      <slot name="footer" />
    </div>
  </details>
  <div x-divider />
</template>

<style scoped>
details {
  --at-apply: border-none;
}

summary {
  --at-apply: border-none;
  list-style: none;
}

details[open] summary {
  --at-apply: border-none;
}

details summary::-webkit-details-marker {
  display:none;
}
</style>
