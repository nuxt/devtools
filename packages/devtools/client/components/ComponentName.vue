<script setup lang="ts">
import type { Component } from 'nuxt/schema'
import { pascalCase } from 'scule'

const props = defineProps<{
  component: Component
}>()

// @ts-expect-error types
const name = computed(() => props.component.pascalName || pascalCase(props.component.name || props.component.__name || props.component.kebabName || ''))
</script>

<template>
  <code text-sm font-mono><span op20 mr1>&lt;</span>{{ name }}<span op20 ml1>/&gt;</span></code>
</template>
