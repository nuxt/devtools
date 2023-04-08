<script setup lang="ts">
defineProps({
  search: {
    type: String,
    default: undefined,
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (event: 'update:search', value: string): void
}>()

function update(event: any) {
  emit('update:search', event.target.value)
}
</script>

<template>
  <div flex="~ col gap4" border="b base" flex-1 navbar-glass :class="[{ p4: !noPadding }]">
    <div v-if="$slots.flex" flex="~ gap4">
      <NTextInput
        v-if="search !== undefined"
        placeholder="Search..."
        icon="carbon-search"
        flex-auto
        n="primary"
        :class="{ 'px-5 py-2': !noPadding }"
        :value="search"
        @input="update"
      />
      <slot name="flex" />
    </div>
    <NTextInput
      v-else-if="search !== undefined"
      placeholder="Search..."
      icon="carbon-search"
      n="primary"
      :class="{ 'px-5 py-2': !noPadding }"
      :value="search"
      @input="update"
    />
    <slot />
  </div>
</template>
