<script setup lang="ts">
import type { Component } from 'nuxt/schema'
import type { ComponentRelationship } from '../../types'

const props = defineProps<{
  component: Component
  relationships?: ComponentRelationship[] | null
}>()

const dependencies = computed(() => {
  const deps = props.relationships?.find(i => i.id === props.component.filePath)?.deps
  return deps?.map(i => props.relationships?.find(j => j.id === i)?.id).filter(Boolean) as string[]
})

const dependents = computed(() => {
  const deps = props.relationships?.filter(i => i.deps.includes(props.component.filePath))
  return deps?.map(i => props.relationships?.find(j => j.id === i.id)?.id).filter(Boolean) as string[]
})

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
      <button hover:text-primary>
        <ComponentName :component="component" />
      </button>
      <template #popper>
        <ComponentDetails
          :component="component"
          :dependencies="dependencies"
          :dependents="dependents"
          w-100 pt4
        />
      </template>
    </VDropdown>
    <sup v-if="dependents?.length" ml--1 op50>
      {{ dependents?.length }}
    </sup>
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
