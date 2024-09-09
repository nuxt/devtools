<script setup lang="ts">
import Fuse from 'fuse.js'
import type { Component } from 'nuxt/schema'
import type { ComponentRelationship, ComponentWithRelationships } from '../../types'

const props = defineProps<{
  components: Component[]
  relationships?: ComponentRelationship[] | null
}>()

const search = ref('')
const filterMode = ref<'all' | 'using' | 'not-used'>('all')

const componentWithRelationships = computed(() => {
  const components = props.components
    .map(c => getComponentRelationships(c, props.relationships))
  if (filterMode.value === 'using')
    return components.filter(c => c.dependents?.length)
  else if (filterMode.value === 'not-used')
    return components.filter(c => !c.dependents?.length)
  return components
})

const fuse = computed(() => new Fuse(componentWithRelationships.value, {
  keys: [
    'component.pascalName',
    'component.filePath',
    'component.kebabName',
  ],
}))

const filtered = computed(() => {
  const user: ComponentWithRelationships[] = []
  const lib = new Map<string, ComponentWithRelationships[]>()
  const builtin: ComponentWithRelationships[] = []
  const runtime: ComponentWithRelationships[] = []

  const count = {
    user: 0,
    lib: 0,
    builtin: 0,
    runtime: 0,
  }

  const result = search.value
    ? fuse.value.search(search.value).map(i => i.item)
    : componentWithRelationships.value

  result
    .forEach((component) => {
      const c = component.component
      if (c.filePath && isNodeModulePath(c.filePath)) {
        const name = getModuleNameFromPath(c.filePath)
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
      else if (c.global && !c.filePath) {
        runtime.push(component)
        count.runtime++
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
  <NNavbar v-model:search="search" pb3>
    <template #actions>
      <slot />
    </template>
    <div flex="~ gap-2 items-center">
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
    </div>
  </NNavbar>
  <NSectionBlock
    v-if="filtered.user.length"
    icon="carbon-nominal"
    text="User components"
    :open="filtered.user.length <= DETAILS_MAX_ITEMS"
    :description="`Total components: ${filtered.count.user}`"
  >
    <ComponentItem
      v-for="c of filtered.user"
      :key="c.component.filePath"
      v-bind="c"
    />
  </NSectionBlock>
  <NSectionBlock
    v-if="filtered.runtime.length"
    icon="carbon-load-balancer-global"
    :open="filtered.runtime.length <= DETAILS_MAX_ITEMS"
    text="Runtime components"
    :description="`Total components: ${filtered.count.runtime}`"
  >
    <ComponentItem
      v-for="c of filtered.runtime"
      :key="c.component.filePath"
      v-bind="c"
    />
  </NSectionBlock>
  <NSectionBlock
    v-if="filtered.builtin.length"
    icon="simple-icons-nuxtdotjs"
    text="Built-in components"
    :description="`Total components: ${filtered.count.builtin}`"
  >
    <ComponentItem
      v-for="c of filtered.builtin"
      :key="c.component.filePath"
      v-bind="c"
    />
  </NSectionBlock>
  <NSectionBlock
    v-if="filtered.lib.size"
    :open="filtered.count.lib <= DETAILS_MAX_ITEMS"
    icon="carbon-3d-mpr-toggle"
    text="Components from libraries"
    :description="`${filtered.count.lib} components from ${filtered.lib.size} packages`"
  >
    <div v-for="[key, value] of filtered.lib.entries()" :key="key" ml-2>
      <NIconTitle :text="`${key} (${value.length})`" py1 op50 />
      <div pl4>
        <ComponentItem
          v-for="c of value"
          :key="c.component.filePath"
          v-bind="c"
        />
      </div>
    </div>
  </NSectionBlock>
</template>
