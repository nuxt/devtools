<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
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

const open = useVModel(props, 'open', undefined, { passive: true })
function onToggle(e: any) {
  open.value = e.target.open
}
</script>

<template>
  <details :open="open" @toggle="onToggle">
    <summary class="cursor-pointer select-none hover:bg-active p4" :class="collapse ? '' : 'pointer-events-none'">
      <NIconTitle :icon="icon" :text="text" class="text-xl op75">
        <div>
          <slot name="text">
            {{ text }}
          </slot>
          <div v-if="description || $slots.description" class="text-sm op50">
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
          class="chevron cursor-pointer place-self-start text-base op50 transition duration-500"
        />
      </NIconTitle>
    </summary>
    <div v-lazy-show="open" class="flex flex-col flex-gap2 pb6 pt2" :class="typeof padding === 'string' ? padding : padding ? 'px8' : ''">
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
