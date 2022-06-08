<script setup lang="ts">
import type { Component } from '@nuxt/schema'

definePageMeta({
  icon: 'carbon-nominal',
  display: 'Components',
})

const components = await rpc.getComponents()

const search = $ref('')

const filtered = $computed(() => {
  const user: Component[] = []
  const lib = new Map<string, Component[]>()
  const builtin: Component[] = []

  components
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
  <div p4 flex="~ col gap1">
    <IconTitle icon="carbon-nominal" :text="`User components (${filtered.user.length})`" text-lg op50 />
    <div pl4>
      <ComponentItem v-for="c of filtered.user" :key="c.filePath" :component="c" />
    </div>
    <IconTitle icon="tabler-brand-nuxt" :text="`Built-in components (${filtered.builtin.length})`" text-lg op50 mt5 />
    <div pl4>
      <ComponentItem v-for="c of filtered.builtin" :key="c.filePath" :component="c" />
    </div>
    <IconTitle icon="carbon-3d-mpr-toggle" text="Components from libraries" text-lg op50 mt5 />
    <div v-for="[key, value] of filtered.lib.entries()" :key="key">
      <IconTitle pl4 :text="`${key} (${value.length})`" op50 py1 />
      <div pl8>
        <ComponentItem v-for="c of value" :key="c.filePath" :component="c" />
      </div>
    </div>
  </div>
</template>
