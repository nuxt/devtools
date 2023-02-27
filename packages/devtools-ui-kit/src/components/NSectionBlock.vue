<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    text: string
    description?: string
    containerClass?: string
    collapse?: boolean
    open?: boolean
    padding?: boolean | string
  }>(), {
    containerClass: '',
    open: true,
    padding: true,
    collapse: true,
  },
)
</script>

<template>
  <details :open="open">
    <summary select-none cursor-pointer p4 hover:bg-active :class="collapse ? '' : 'pointer-events-none'">
      <NIconTitle :icon="icon" :text="text" text-xl op75>
        <div>
          {{ text }}
          <div v-if="description" op50 text-sm>
            {{ description }}
          </div>
        </div>
        <div flex-auto />
        <NIcon
          v-if="collapse"
          icon="carbon-chevron-down" text-base op50 cursor-pointer transition duration-500 place-self-start
          class="chevron"
        />
      </NIconTitle>
    </summary>
    <div flex="~ col gap2" pt2 pb6 :class="typeof padding === 'string' ? padding : padding ? 'px8' : ''">
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
