<script setup lang="ts">
import type { Component } from '@nuxt/schema'
import { pascalCase } from 'scule'

const { component } = defineProps<{
  component: Component
}>()

const config = $(useServerConfig())
// @ts-expect-error types
const name = $computed(() => component.pascalName || pascalCase(component.name || component.__name || component.kebabName || ''))
// @ts-expect-error types
const filePath = $computed(() => component.filePath || component.file || component.__file || '')
const copy = useCopy()
</script>

<template>
  <div
    rounded
    px2
    py1
    hover="bg-gray/10"
    class="group"
    flex="~ gap2"
    w-full items-center
  >
    <button hover:text-primary @click="copy(`<${name}></${name}>`)">
      <code font-mono text-sm><span op20 mr1>&lt;</span>{{ name }}<span op20 ml1>/&gt;</span></code>
    </button>
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
      op0 group-hover:op50 text-sm
    />
  </div>
</template>
