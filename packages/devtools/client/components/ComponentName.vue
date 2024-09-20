<script setup lang="ts">
import type { Component } from 'nuxt/schema'
import { pascalCase } from 'scule'
import { computed } from 'vue'

const props = defineProps<{
  component: Component
}>()

// @ts-expect-error types
const name = computed(() => props.component.pascalName || pascalCase(props.component.name || props.component.__name || props.component.kebabName || ''))
</script>

<template>
  <code text-sm font-mono><span mr1 op20>&lt;</span>{{ name }}<span ml1 op20>/&gt;</span></code>
</template>
