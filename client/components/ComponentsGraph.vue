<script setup lang="ts">
import type { Component, NuxtLayout, NuxtPage } from '@nuxt/schema'
import type { Data, Node, Options } from 'vis-network'
import { Network } from 'vis-network'
import type { ComponentRelationship } from '~~/../src/types'

const props = defineProps<{
  components: Component[]
}>()

const container = ref<HTMLElement>()
const colorMode = useColorMode()

const selected = ref<{
  id: string
  component?: Component
  page?: NuxtPage
  layout?: NuxtLayout
  relationship?: ComponentRelationship
}>()

const pages = useServerPages()
const layouts = useLayouts()
const relationships = useComponentsRelationships()

const {
  componentsGraphShowNodeModules: showNodeModules,
  componentsGraphShowPages: showPages,
  componentsGraphShowLayouts: showLayouts,
} = devToolsSettingsRefs

const selectedFilter = ref<ComponentRelationship>()

const entries = computed(() => {
  const relations = (relationships.value || [])
  if (selectedFilter.value) {
    const set = new Set<ComponentRelationship>()
    relations.find(i => i.id === selected.value?.id)
    function addToSet(rel?: ComponentRelationship) {
      if (!rel || set.has(rel))
        return
      set.add(rel)
      rel.deps.forEach((dep) => {
        addToSet(relations.find(i => i.id === dep))
      })
    }
    addToSet(selectedFilter.value)
    return Array.from(set)
  }
  return relations
})

const data = computed<Data>(() => {
  const nodes: Data['nodes'] = entries.value.map((rel): Node | null => {
    const component = props.components.find(i => i.filePath === rel.id)
    const page = pages.value?.find(i => i.file === rel.id)
    const layout = layouts.value?.find(i => i.file === rel.id)

    const path = rel.id.replace(/\?.*$/, '').replace(/\#.*$/, '')
    const group = rel.id.includes('/node_modules/')
      ? 'lib'
      : component
        ? 'user'
        : layout
          ? 'layout'
          : page
            ? 'page'
            : 'unknown'

    if (!showNodeModules.value && group === 'lib')
      return null
    if (!showPages.value && group === 'page')
      return null
    if (!showLayouts.value && group === 'layout')
      return null

    const shape = group === 'layout'
      ? 'hexagon'
      : group === 'page'
        ? 'square'
        : 'dot'

    return {
      id: rel.id,
      label: path.split('/').splice(-1)[0],
      group,
      shape,
      size: 15 + Math.min(rel.deps.length / 2, 8),
      font: { color: colorMode.value === 'dark' ? 'white' : 'black' },
      // @ts-expect-error additional data
      extra: {
        id: rel.id,
        component,
        page,
        layout,
        relationship: rel,
      },
    }
  }).filter((x): x is Node => !!x)

  const edges: Data['edges'] = entries.value.flatMap(rel => rel.deps.map(dep => ({
    from: rel.id,
    to: dep,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.8,
      },
    },
  })))

  return {
    nodes,
    edges,
  }
})

onMounted(() => {
  const options: Options = {
    nodes: {
      shape: 'dot',
      size: 16,
    },
    physics: {
      repulsion: {
        centralGravity: 0.7,
        springLength: 100,
        springConstant: 0.01,
      },
      maxVelocity: 146,
      solver: 'forceAtlas2Based',
      timestep: 0.35,
      stabilization: {
        enabled: true,
        iterations: 200,
      },
    },
    groups: {
      user: {
        color: '#42b883',
      },
      unknown: {
        color: '#b86542',
      },
      lib: {
        color: '#b4b842',
      },
      page: {
        color: '#42b2b8',
      },
      layout: {
        color: '#4256b8',
      },
    },
  }
  const network = new Network(container.value!, data.value, options)

  network.on('click', (e) => {
    const id = e.nodes?.[0]
    const node = (data.value.nodes as any[])?.find(i => i.id === id)?.extra
    if (node)
      selected.value = node
  })

  watch(data, () => {
    network.setData(data.value)
  })
})

function setFilter() {
  selectedFilter.value = selected.value?.relationship
  selected.value = undefined
}
</script>

<template>
  <div h-full flex="~ col">
    <div border="b base" flex="~ gap4" py1 px4 h-10 flex-none items-center>
      <NCheckbox v-model="showPages" n="primary sm">
        <span op75>Show pages</span>
      </NCheckbox>
      <NCheckbox v-model="showLayouts" n="primary sm">
        <span op75>Show layouts</span>
      </NCheckbox>
      <NCheckbox v-model="showNodeModules" n="primary sm">
        <span op75>Show node_modules</span>
      </NCheckbox>
      <button v-if="selectedFilter" flex="~ gap-1" items-center bg-gray:20 pl3 pr2 py1 rounded-full text-xs op50 hover:op100 @click="selectedFilter = undefined">
        Clear filter <div i-carbon-close />
      </button>
    </div>
    <div h-full w-full relative>
      <div ref="container" w-full h-full />
      <div
        v-if="selected"
        border="~ base"
        absolute right-4 top-4 text-sm
        rounded bg-base shadow
        p2 flex="~ col gap-1" items-end
      >
        <FilepathItem :filepath="selected.id" />
        <NButton n="primary solid" @click="setFilter()">
          Filter to this component
        </NButton>
      </div>
    </div>
  </div>
</template>
