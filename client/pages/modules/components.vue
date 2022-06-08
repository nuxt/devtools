<script setup lang="ts">
import type { Component } from '@nuxt/schema'
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'carbon-nominal',
  display: 'Components',
})

const components = await rpc.getComponents()
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
    .sort((a, b) => a.pascalName.localeCompare(b.pascalName))
    .forEach((component) => {
      if (component.filePath.match(/[/\\]node_modules[/\\]/)) {
        const name = getModuleName(component.filePath)
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

function getModuleName(path: string) {
  const match = path.replace(/\\/g, '/').match(/.*\/node_modules\/(.*)$/)[1] || ''
  if (match.startsWith('@'))
    return match.split('/').slice(0, 2).join('/')
  return match.split('/')[0]
}
</script>

<template>
  <div>
    <div p4 flex="~ col gap2">
      <input
        v-model="search"
        placeholder="Search..."
        type="text"
        p="x4 y2"
        w="full"
        bg="transparent"
        border="~ rounded base"
        outline="none active:none"
      >
    </div>
    <template v-if="filtered.user.length">
      <div x-divider />
      <div px4 py2 flex="~ col gap2">
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
