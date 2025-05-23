<script setup lang="ts">
import type { Component } from 'nuxt/schema'
import { computed } from 'vue'

const props = defineProps<{
  component: Component
  dependencies?: string[]
  dependents?: string[]
}>()

// @ts-expect-error types
const filePath = computed(() => props.component.filePath || props.component.file || props.component.__file || '')
</script>

<template>
  <div
    hover="bg-active"
    class="group"
    flex="~ gap2"
    w-full items-center rounded px2 py1
  >
    <VDropdown>
      <button hover:text-primary :class="dependents && dependents.length === 0 ? 'op50' : ''">
        <ComponentName :component="component" />
      </button>
      <template #popper>
        <ComponentDetails
          :component="component"
          :dependencies="dependencies"
          :dependents="dependents"
          w-100 pt3
        />
      </template>
    </VDropdown>
    <sup v-if="dependents?.length" ml--1 text-primary>
      x{{ dependents?.length }}
    </sup>
    <NBadge
      v-if="component.global"
      n="green"
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
