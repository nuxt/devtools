<script setup lang="ts">
import type { Import } from 'unimport'
import { definePageMeta } from '#imports'
import Fuse from 'fuse.js'
import { computed, ref } from 'vue'
import { DETAILS_MAX_ITEMS } from '~/composables/constants'
import { useAutoImports, useServerConfig } from '~/composables/state'
import { getModuleNameFromPath, isBuiltInModule, isNodeModulePath } from '~/composables/utils'

definePageMeta({
  icon: 'carbon-function',
  title: 'Imports',
  order: 4,
})

const config = useServerConfig()
const filterMode = ref<'all' | 'using' | 'not-used'>('all')
const filterEntries = ref<'all' | 'composables' | 'directives'>('all')

const search = ref('')
const autoImports = useAutoImports()
const importsMetadata = computed(() => autoImports.value?.metadata)

const functions = computed(() => autoImports.value?.imports.filter(i => i.as || i.name).sort((a, b) => (a.as || a.name).localeCompare(b.as || b.name))
  || [])

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

  const filter = filterEntries.value

  if (filter === 'composables') {
    result = result.filter(i => !(i.meta?.vueDirective === true))
  }
  else if (filter === 'directives') {
    result = result.filter(i => i.meta?.vueDirective === true)
  }

  if (filterMode.value === 'using' && importsMetadata.value) {
    result = result
      .filter(i => (i.as || i.name) in importsMetadata.value!.injectionUsage)
  }
  else if (filterMode.value === 'not-used' && importsMetadata.value) {
    result = result
      .filter(i => !((i.as || i.name) in importsMetadata.value!.injectionUsage))
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

const filteredUserCountTitle = computed(() => {
  return filterEntries.value === 'directives'
    ? `${filtered.value.count.user} directives from ${filtered.value.user.size} modules`
    : `${filtered.value.count.user} composables from ${filtered.value.user.size} modules`
})
const filteredBuiltinTitle = computed(() => {
  return filterEntries.value === 'directives'
    ? `${filtered.value.count.builtin} directives`
    : `${filtered.value.count.builtin} composables`
})
const filteredLibTitle = computed(() => {
  return filterEntries.value === 'directives'
    ? `${filtered.value.count.lib} directives from ${filtered.value.lib.size} packages`
    : `${filtered.value.count.lib} composables from ${filtered.value.lib.size} packages`
})
</script>

<template>
  <div v-if="config" relative h-full of-auto>
    <NNavbar v-model:search="search" pb3>
      <div v-if="importsMetadata" class="filter" flex="~ gap-2 items-center">
        <NIcon icon="carbon-filter" op50 />
        <NSelectTabs
          v-model="filterMode"
          n="primary sm"
          :options="[
            { label: 'All', value: 'all' },
            { label: 'Using', value: 'using' },
            { label: 'Not used', value: 'not-used' },
          ]"
        />
        <NSelectTabs
          v-model="filterEntries"
          n="primary sm"
          :options="[
            { label: 'All', value: 'all' },
            { label: 'Composables', value: 'composables' },
            { label: 'Directives', value: 'directives' },
          ]"
        />
      </div>
    </NNavbar>
    <NSectionBlock
      v-if="filtered.user.size"
      :open="filtered.count.user <= DETAILS_MAX_ITEMS"
      :icon="filterEntries === 'directives' ? 'tabler:hexagon-letter-d' : 'carbon-function'"
      :text="`User ${filterEntries === 'directives' ? 'directives' : 'composables'}`"
      :description="filteredUserCountTitle"
    >
      <ComposableTree :map="filtered.user" :root="config.rootDir" :metadata="importsMetadata" />
    </NSectionBlock>
    <NSectionBlock
      v-if="filtered.builtin.size"
      :open="filtered.count.builtin <= DETAILS_MAX_ITEMS"
      icon="simple-icons-nuxtdotjs"
      :text="`Built-in ${filterEntries === 'directives' ? 'directives' : 'composables'}`"
      :description="filteredBuiltinTitle"
    >
      <ComposableTree :map="filtered.builtin" :root="config.rootDir" :metadata="importsMetadata" />
    </NSectionBlock>
    <NSectionBlock
      v-if="filtered.lib.size"
      :open="filtered.count.lib <= DETAILS_MAX_ITEMS"
      icon="carbon-3d-mpr-toggle"
      :text="`${filterEntries === 'directives' ? 'Directives' : 'Composables'} from libraries`"
      :description="filteredLibTitle"
    >
      <ComposableTree :map="filtered.lib" :root="config.rootDir" :metadata="importsMetadata" />
    </NSectionBlock>
  </div>

  <HelpFab>
    <DocsImports />
  </HelpFab>
</template>

<style scoped>
@screen lt-sm {
  .filter {
    --uno: flex-col flex-items-start;
  }
}
</style>
