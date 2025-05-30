<script setup lang="ts">
import type { Component } from 'nuxt/schema'
import { pascalCase } from 'scule'
import { computed } from 'vue'
import { useCopy } from '~/composables/editor'

const props = defineProps<{
  component: Component
  dependencies?: string[]
  dependents?: string[]
}>()

// @ts-expect-error types
const name = computed(() => props.component.pascalName || pascalCase(props.component.name || props.component.__name || props.component.kebabName || ''))
// @ts-expect-error types
const filePath = computed(() => props.component.filePath || props.component.file || props.component.__file || '')
const copy = useCopy()
</script>

<template>
  <div flex="~ col gap1" items-start of-hidden>
    <div flex="~ gap2 items-center" px3>
      <ComponentName :component="component" />
      <NButton
        v-if="component.meta?.docs && typeof component.meta.docs === 'string'"
        title="Open docs" flex-none n="xs"
        :to="component.meta.docs" target="_blank"
        icon="carbon-catalog"
      >
        Docs
      </NButton>
      <NButton
        title="Copy name" flex-none n="xs"
        icon="carbon-copy"
        @click="copy(`<${name}></${name}>`, 'component-name')"
      >
        Copy
      </NButton>
      <NBadge
        v-if="component.global"
        n="green"
        title="Registered at runtime as a global component"
        v-text="'runtime'"
      />
    </div>
    <div px3 pb2>
      <FilepathItem
        v-if="filePath"
        :filepath="filePath"
        w-full text-sm op40 group-hover:op75
      />
    </div>

    <div v-if="dependents" border="t base" max-h-60 w-full of-auto px3 py3>
      <div text-sm>
        <strong text-primary>{{ dependents.length }}</strong><span op50> references</span>
      </div>
      <div v-if="dependents.length" flex="~ col gap-2" items-start pt3 text-sm op75>
        <FilepathItem
          v-for="id of dependents" :key="id"
          :filepath="id"
        />
      </div>
    </div>

    <div v-if="dependencies" border="t base" max-h-60 w-full of-auto px3 py3>
      <div text-sm>
        <strong text-primary>{{ dependencies.length }}</strong><span op50> dependencies</span>
      </div>
      <div v-if="dependencies.length" flex="~ col gap-2" items-start pt3 text-sm op75>
        <FilepathItem
          v-for="id of dependencies" :key="id"
          :filepath="id"
        />
      </div>
    </div>

    <slot />
  </div>
</template>
