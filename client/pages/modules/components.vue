<script setup lang="ts">
import type { Component } from '@nuxt/schema'
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'carbon-nominal',
  display: 'Components',
})

const components = (await rpc.getComponents())
  .sort((a, b) => a.pascalName.localeCompare(b.pascalName))
const fuse = new Fuse(components, {
  keys: [
    'pascalName',
    'filePath',
    'kebabName',
  ],
})

const search = $ref('')

const filtered = $computed(() => {
  const user: Component[] = []
  const lib = new Map<string, Component[]>()
  const builtin: Component[] = []

  const result = search ? fuse.search(search).map(i => i.item) : components

  result
    .forEach((component) => {
      if (isNodeModulePath(component.filePath)) {
        const name = getModuleNameFromPath(component.filePath)
        if (name === 'nuxt') {
          builtin.push(component)
        }
        else {
          if (!lib.has(name))
            lib.set(name, [])
          lib.get(name).push(component)
        }
      }
      else {
        user.push(component)
      }
    })

  return {
    user,
    builtin,
    lib,
  }
})
</script>

<template>
  <div>
    <div p4 flex="~ col gap2">
      <NTextInput
        v-model="search"
        placeholder="Search..."
        p="x4 y2"
        n="primary"
      />
    </div>
    <template v-if="filtered.user.length">
      <div x-divider />
      <div p4 flex="~ col gap2">
        <IconTitle icon="carbon-nominal" :text="`User components (${filtered.user.length})`" text-lg op50 />
        <div pl4>
          <ComponentItem v-for="c of filtered.user" :key="c.filePath" :component="c" />
        </div>
      </div>
    </template>
    <template v-if="filtered.builtin.length">
      <div x-divider />
      <div p4 flex="~ col gap2">
        <IconTitle icon="tabler-brand-nuxt" :text="`Built-in components (${filtered.builtin.length})`" text-lg op50 />
        <div pl4>
          <ComponentItem v-for="c of filtered.builtin" :key="c.filePath" :component="c" />
        </div>
      </div>
    </template>
    <template v-if="filtered.lib.size">
      <div x-divider />
      <div p4 flex="~ col gap2">
        <IconTitle icon="carbon-3d-mpr-toggle" text="Components from libraries" text-lg op50 />
        <div v-for="[key, value] of filtered.lib.entries()" :key="key">
          <IconTitle pl4 :text="`${key} (${value.length})`" op50 py1 />
          <div pl8>
            <ComponentItem v-for="c of value" :key="c.filePath" :component="c" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
