<script setup lang="ts">
import type { Component } from '@nuxt/schema'
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'carbon-nominal',
  title: 'Components',
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
        if (!name)
          return
        if (name === 'nuxt') {
          builtin.push(component)
        }
        else {
          if (!lib.has(name))
            lib.set(name, [])
          lib.get(name)!.push(component)
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
    <SectionBlock
      v-if="filtered.user.length"
      icon="carbon-nominal"
      :text="`User components (${filtered.user.length})`"
    >
      <ComponentItem v-for="c of filtered.user" :key="c.filePath" :component="c" />
    </SectionBlock>
    <SectionBlock
      v-if="filtered.builtin.length"
      icon="tabler-brand-nuxt"
      :text="`Built-in components (${filtered.builtin.length})`"
    >
      <ComponentItem v-for="c of filtered.builtin" :key="c.filePath" :component="c" />
    </SectionBlock>
    <SectionBlock
      v-if="filtered.lib.size"
      icon="carbon-3d-mpr-toggle"
      text="Components from libraries"
    >
      <div v-for="[key, value] of filtered.lib.entries()" :key="key">
        <IconTitle :text="`${key} (${value.length})`" op50 py1 />
        <div pl4>
          <ComponentItem v-for="c of value" :key="c.filePath" :component="c" />
        </div>
      </div>
    </SectionBlock>
  </div>
</template>
