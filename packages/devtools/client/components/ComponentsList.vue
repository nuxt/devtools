<script setup lang="ts">
import type { Component } from 'nuxt/schema'
import Fuse from 'fuse.js'

const props = defineProps<{
  components: Component[]
  search: string
}>()

const fuse = computed(() => new Fuse(props.components, {
  keys: [
    'pascalName',
    'filePath',
    'kebabName',
  ],
}))

const filtered = computed(() => {
  const user: Component[] = []
  const lib = new Map<string, Component[]>()
  const builtin: Component[] = []
  const runtime: Component[] = []

  const count = {
    user: 0,
    lib: 0,
    builtin: 0,
    runtime: 0,
  }

  const result = props.search
    ? fuse.value.search(props.search).map(i => i.item)
    : props.components

  result
    .forEach((component) => {
      if (component.global) {
        runtime.push(component)
        count.runtime++
        return
      }

      if (component.filePath && isNodeModulePath(component.filePath)) {
        const name = getModuleNameFromPath(component.filePath)
        if (!name)
          return
        if (name === 'nuxt') {
          builtin.push(component)
          count.builtin++
        }
        else {
          if (!lib.has(name))
            lib.set(name, [])
          lib.get(name)!.push(component)
          count.lib++
        }
      }
      else {
        user.push(component)
        count.user++
      }
    })

  return {
    count,

    user,
    builtin,
    lib,
    runtime,
  }
})
</script>

<template>
  <NSectionBlock
    v-if="filtered.user.length"
    icon="carbon-nominal"
    text="User components"
    :description="`Total components: ${filtered.count.user}`"
  >
    <ComponentItem v-for="c of filtered.user" :key="c.filePath" ml--5 :component="c" />
  </NSectionBlock>
  <NSectionBlock
    v-if="filtered.runtime.length"
    icon="carbon-load-balancer-global"

    text="Runtime components"
    :description="`Total components: ${filtered.count.runtime}`"
  >
    <ComponentItem v-for="c of filtered.runtime" :key="c.filePath" ml--5 :component="c" />
  </NSectionBlock>
  <NSectionBlock
    v-if="filtered.builtin.length"
    icon="simple-icons-nuxtdotjs"
    text="Built-in components"
    :description="`Total components: ${filtered.count.builtin}`"
  >
    <ComponentItem v-for="c of filtered.builtin" :key="c.filePath" ml--5 :component="c" />
  </NSectionBlock>
  <NSectionBlock
    v-if="filtered.lib.size"
    icon="carbon-3d-mpr-toggle"
    text="Components from libraries"
    :description="`${filtered.count.lib} components from ${filtered.lib.size} packages`"
  >
    <div v-for="[key, value] of filtered.lib.entries()" :key="key">
      <NIconTitle :text="`${key} (${value.length})`" op50 py1 />
      <div pl4>
        <ComponentItem v-for="c of value" :key="c.filePath" :component="c" />
      </div>
    </div>
  </NSectionBlock>
</template>
