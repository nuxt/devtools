<script setup lang="ts">
import type { Import } from 'unimport'
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'carbon-function',
  title: 'Imports',
  order: 3,
})

const config = useServerConfig()
const onlyUsed = ref(false)

const search = ref('')
const autoImports = useAutoImports()
const importsMetadata = computed(() => autoImports.value?.metadata)

const functions = computed(() => autoImports.value?.imports
  .filter(i => i.as || i.name)
  .sort((a, b) => (a.as || a.name).localeCompare(b.as || b.name))
  || [],
)

const fuse = computed(() => new Fuse(functions.value, {
  keys: [
    'from',
    'as',
    'name',
  ],
}))

const filtered = computed(() => {
  const user = new Map<string, Import[]>()
  const lib = new Map<string, Import[]>()
  const builtin = new Map<string, Import[]>()
  let result = search.value
    ? fuse.value.search(search.value).map(i => i.item)
    : functions.value

  if (onlyUsed.value && importsMetadata.value) {
    result = result
      .filter(i => (i.as || i.name) in importsMetadata.value!.injectionUsage)
  }

  const count = {
    user: 0,
    lib: 0,
    builtin: 0,
  }

  result
    .forEach((i) => {
      const map = isNodeModulePath(i.from)
        ? isBuiltInModule(getModuleNameFromPath(i.from))
          ? builtin
          : lib
        : user
      if (!map.has(i.from))
        map.set(i.from, [])
      map.get(i.from)!.push(i)
      count[map === user ? 'user' : map === lib ? 'lib' : 'builtin']++
    })

  return {
    user,
    lib,
    builtin,
    count,
  }
})
</script>

<template>
  <div v-if="config" h-full of-auto>
    <div flex="~ col gap4" border="b base" px4 flex-1 navbar-glass pb2 pt4>
      <NTextInput
        v-model="search"
        placeholder="Search..."
        icon="carbon-search"
        p="x5 y2"
        n="primary"
      />
      <div v-if="importsMetadata">
        <NSwitch v-model="onlyUsed" n="primary sm">
          Show used only
        </NSwitch>
      </div>
    </div>
    <NSectionBlock
      v-if="filtered.user.size"
      icon="carbon-function"
      text="User composables"
      :description="`${filtered.count.user} composables from ${filtered.user.size} modules`"
    >
      <ComposableTree :map="filtered.user" :root="config.rootDir" :metadata="importsMetadata" />
    </NSectionBlock>
    <NSectionBlock
      v-if="filtered.builtin.size"
      icon="simple-icons-nuxtdotjs"
      text="Built-in composables"
      :description="`${filtered.count.builtin} composables`"
    >
      <ComposableTree :map="filtered.builtin" :root="config.rootDir" :metadata="importsMetadata" />
    </NSectionBlock>
    <NSectionBlock
      v-if="filtered.lib.size"
      icon="carbon-3d-mpr-toggle"
      text="Composables from libraries"
      :description="`${filtered.count.lib} composables from ${filtered.lib.size} packages`"
    >
      <ComposableTree :map="filtered.lib" :root="config.rootDir" :metadata="importsMetadata" />
    </NSectionBlock>
  </div>
</template>
