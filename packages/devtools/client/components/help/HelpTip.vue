<script setup lang="ts">
defineProps<{
  title: string
  icon?: string
}>()
</script>

<template>
  <div class="n-tip n-tip-base" flex="~ col items-start" mx--4 px4 py4>
    <div flex="~ items-center gap-1" font-bold>
      <NIcon v-if="icon" :icon="icon" class="n-tip-icon" />
      <div>
        {{ title }}
      </div>
    </div>
    <div>
      <slot>
        <ContentSlot :use="$slots.default" unwrap="p" />
      </slot>
    </div>
  </div>
</template>
