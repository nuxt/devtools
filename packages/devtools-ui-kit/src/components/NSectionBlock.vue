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
    <summary class="select-none cursor-pointer p4 hover:bg-active" :class="collapse ? '' : 'pointer-events-none'">
      <NIconTitle :icon="icon" :text="text" class="text-xl op75">
        <div>
          <slot name="text">
            {{ text }}
          </slot>
          <div v-if="description || $slots.description" class="op50 text-sm">
            <slot name="description">
              {{ description }}
            </slot>
          </div>
        </div>
        <div class="flex-auto" />
        <slot name="actions" />
        <NIcon
          v-if="collapse"
          icon="carbon-chevron-down"
          class="op50 cursor-pointer text-base transition duration-500 place-self-start chevron"
        />
      </NIconTitle>
    </summary>
    <div class="flex flex-col flex-gap2 pt2 pb6" :class="typeof padding === 'string' ? padding : padding ? 'px8' : ''">
      <slot name="details" />
      <div :class="containerClass" class="mt1">
        <slot />
      </div>
      <slot name="footer" />
    </div>
  </details>
  <div class="x-divider" />
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
