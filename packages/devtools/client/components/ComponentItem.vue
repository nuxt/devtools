<script setup lang="ts">
import type { Component } from 'nuxt/schema'

const props = defineProps<{
  component: Component
}>()

// @ts-expect-error types
const filePath = computed(() => props.component.filePath || props.component.file || props.component.__file || '')
</script>

<template>
  <div

    hover="bg-active"
    class="group"
    flex="~ gap2"
    rounded w-full items-center px2 py1
  >
    <VDropdown>
      <button hover:text-primary>
        <ComponentName :component="component" />
      </button>
      <template #popper>
        <ComponentDetails :component="component" p4 />
      </template>
    </VDropdown>
    <Badge
      v-if="component.global"
      bg-green-400:10 text-green-400
      title="Registered at runtime as a global component"
      v-text="'runtime'"
    />
    <slot />
    <FilepathItem
      v-if="filePath"
      :filepath="filePath"
      text-sm op25 group-hover:op75
    />
  </div>
</template>
