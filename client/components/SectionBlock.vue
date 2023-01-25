<script setup lang="ts">
const {
  containerClass = '',
  open = true,
  padding = true,
  collapse = true,
} = defineProps<{
  icon?: string
  text: string
  description?: string
  containerClass?: string
  collapse?: boolean
  open?: boolean
  padding?: boolean
}>()
</script>

<template>
  <details p4 :open="open">
    <summary select-none :class="collapse ? '' : 'pointer-events-none'">
      <IconTitle :icon="icon" :text="text" text-xl op75>
        <div>
          {{ text }}
          <div v-if="description" op50 text-sm>
            {{ description }}
          </div>
        </div>
        <div flex-auto />
        <NIcon
          v-if="collapse"
          icon="carbon-chevron-down" text-base transition duration-500 op50 place-self-start
          class="chevron"
        />
      </IconTitle>
    </summary>
    <div flex="~ col gap2" py2 :class="padding ? 'pl8' : ''">
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

details[open] .chevron {
  transform: rotate(180deg);
  opacity: 0.75;
}
</style>
