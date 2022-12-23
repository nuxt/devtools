<script setup lang="ts">
import Fuse from 'fuse.js'
import type { Import } from 'unimport'
import { config } from '#imports'

definePageMeta({
  icon: 'carbon-function',
  title: 'Composables',
})

const search = $ref('')
const functions = (await rpc.getAutoImports())
  .filter(i => i.as || i.name)
  .sort((a, b) => (a.as || a.name).localeCompare(b.as || b.name))

const fuse = new Fuse(functions, {
  keys: [
    'from',
    'as',
    'name',
  ],
})

const filtered = $computed(() => {
  const user = new Map<string, Import[]>()
  const lib = new Map<string, Import[]>()
  const builtin = new Map<string, Import[]>()
  const result = search ? fuse.search(search).map(i => i.item) : functions

  result
    .forEach((i) => {
      const map = isNodeModulePath(i.from)
        ? isBuiltInModule(getModuleNameFromPath(i.from))
          ? builtin
          : lib
        : user
      if (!map.has(i.from))
        map.set(i.from, [])
      map.get(i.from).push(i)
    })

  return {
    user,
    lib,
    builtin,
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
      v-if="filtered.user.size"
      icon="carbon-function"
      text="User composables"
    >
      <ComposableTree :map="filtered.user" :root="config.rootDir" />
    </SectionBlock>
    <SectionBlock
      v-if="filtered.builtin.size"
      icon="tabler-brand-nuxt"
      text="Built-in composables"
    >
      <ComposableTree :map="filtered.builtin" :root="config.rootDir" />
    </SectionBlock>
    <SectionBlock
      v-if="filtered.lib.size"
      icon="carbon-3d-mpr-toggle"
      text="Composables from libraries"
    >
      <ComposableTree :map="filtered.lib" :root="config.rootDir" />
    </SectionBlock>
  </div>
</template>
