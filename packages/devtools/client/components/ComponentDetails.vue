<script setup lang="ts">
import type { Component } from 'nuxt/schema'
import { pascalCase } from 'scule'

const props = defineProps<{
  component: Component
}>()

// @ts-expect-error types
const name = computed(() => props.component.pascalName || pascalCase(props.component.name || props.component.__name || props.component.kebabName || ''))
// @ts-expect-error types
const filePath = computed(() => props.component.filePath || props.component.file || props.component.__file || '')
const copy = useCopy()
</script>

<template>
  <div flex="~ col gap1">
    <div flex="~ gap2">
      <div>
        <ComponentName :component="component" />
      </div>
      <button title="Copy name" n-icon-btn @click="copy(`<${name}></${name}>`)">
        <div i-carbon-copy />
      </button>
      <Badge
        v-if="component.global"
        bg-green-400:10 text-green-400
        title="Registered at runtime as a global component"
        v-text="'runtime'"
      />
    </div>
    <FilepathItem
      v-if="filePath"
      :filepath="filePath"
      text-sm op25 group-hover:op75
    />
    <slot />
  </div>
</template>
