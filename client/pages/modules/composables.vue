<script setup lang="ts">
import Fuse from 'fuse.js'
import type { Import } from 'unimport'
import { getShortPath, openInEditor } from '#imports'

const props = defineProps<{
  modelValue?: boolean
}>()

definePageMeta({
  icon: 'carbon-function',
  display: 'Composables',
})

const search = $ref('')
const config = await useConfig()
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
    <template v-if="filtered.user.size">
      <div x-divider />
      <div p4 flex="~ col gap2">
        <IconTitle icon="carbon-function" text="User composables" text-lg op50 />
        <div pl4>
          <ComposableTree :map="filtered.user" :root="config.rootDir" />
        </div>
      </div>
    </template>
    <template v-if="filtered.builtin.size">
      <div x-divider />
      <div p4 flex="~ col gap2">
        <IconTitle icon="tabler-brand-nuxt" text="Built-in composables" text-lg op50 />
        <div pl4>
          <ComposableTree :map="filtered.builtin" :root="config.rootDir" />
        </div>
      </div>
    </template>
    <template v-if="filtered.lib.size">
      <div x-divider />
      <div p4 flex="~ col gap2">
        <IconTitle icon="carbon-3d-mpr-toggle" text="Composables from libraries" text-lg op50 />
        <div pl4>
          <ComposableTree :map="filtered.lib" :root="config.rootDir" />
        </div>
      </div>
    </template>
  </div>
</template>
