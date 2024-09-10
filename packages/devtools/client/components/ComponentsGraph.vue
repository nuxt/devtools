<script setup lang="ts">
import { Network } from 'vis-network'
import type { ComponentRelationship } from '~/../src/types'
import type { Component, NuxtLayout, NuxtPage } from 'nuxt/schema'
import type { Data, Node, Options } from 'vis-network'

const props = defineProps<{
  components: Component[]
  relationships?: ComponentRelationship[] | null
}>()

const container = ref<HTMLElement>()
const navbar = ref<HTMLElement>()
const colorMode = getColorMode()

const selected = ref<{
  id: string
  component?: Component
  page?: NuxtPage
  layout?: NuxtLayout
  relationship?: ComponentRelationship
}>()

const pages = useServerPages()
const config = useServerConfig()
const layouts = useLayouts()

const {
  componentsGraphShowNodeModules: showNodeModules,
  componentsGraphShowGlobalComponents: showGlobalComponents,
  componentsGraphShowPages: showPages,
  componentsGraphShowLayouts: showLayouts,
  componentsGraphShowWorkspace: showWorkspace,
} = useDevToolsUIOptions()

const selectedFilter = ref<ComponentRelationship>()

const search = ref('')
const searchDebounced = useDebounce(search, 300)

const entries = computed(() => {
  const relations = (props.relationships || [])
  if (selectedFilter.value) {
    const set = new Set<ComponentRelationship>()
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

    const path = rel.id.replace(/\?.*$/, '').replace(/#.*$/, '')
    const group = rel.id.includes('/node_modules/')
      ? 'lib'
      : component
        ? component.global
          ? 'global'
          : 'user'
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
    if (!showWorkspace.value && group === 'user' && config.value && !rel.id.startsWith(config.value.rootDir))
      return null
    if (!showGlobalComponents.value && group === 'global')
      return null

    const shape = group === 'layout'
      ? 'hexagon'
      : group === 'page'
        ? 'square'
        : 'dot'

    const isGrayedOut = searchDebounced.value && !rel.id.toLowerCase().includes(searchDebounced.value.toLowerCase())

    return {
      id: rel.id,
      label: path.split('/').splice(-1)[0].replace(/\.\w+$/, ''),
      group,
      shape,
      size: 15 + Math.min(rel.deps.length / 2, 8),
      font: {
        color: isGrayedOut ? '#8885' : (colorMode.value === 'dark' ? 'white' : 'black'),
      },
      color: isGrayedOut ? '#8885' : selectedFilter.value?.id === rel.id ? '#82c742' : undefined,
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

const selectedDependencies = computed(() => {
  if (!selected.value?.component)
    return []
  const deps = props.relationships?.find(i => i.id === selected.value?.component?.filePath)?.deps
  return deps?.map(i => props.relationships?.find(j => j.id === i)?.id).filter(Boolean) as string[]
})

const selectedDependents = computed(() => {
  if (!selected.value?.component)
    return []
  const deps = props.relationships?.filter(i => i.deps.includes(selected.value!.component!.filePath!))
  return deps?.map(i => props.relationships?.find(j => j.id === i.id)?.id).filter(Boolean) as string[]
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
  <NNavbar ref="navbar" v-model:search="search" absolute left-0 right-0 top-0>
    <template #actions>
      <div flex="~ gap-4 wrap" w-full>
        <NCheckbox v-model="showPages" n="primary sm">
          <span op75>Show pages</span>
        </NCheckbox>
        <NCheckbox v-model="showLayouts" n="primary sm">
          <span op75>Show layouts</span>
        </NCheckbox>
        <NCheckbox v-model="showWorkspace" n="primary sm">
          <span op75>Show workspace</span>
        </NCheckbox>
        <NCheckbox v-model="showNodeModules" n="primary sm">
          <span op75>Show node_modules</span>
        </NCheckbox>
        <NCheckbox v-model="showGlobalComponents" n="primary sm">
          <span op75>Show global components</span>
        </NCheckbox>
      </div>
      <button v-if="selectedFilter" flex="~ gap-1" flex-none items-center rounded-full bg-gray:20 py1 pl3 pr2 text-xs op50 hover:op100 @click="selectedFilter = undefined">
        Clear filter <div i-carbon-close />
      </button>
      <div flex-auto />
      <slot />
    </template>
  </NNavbar>

  <div relative h-full w-full>
    <div ref="container" h-full w-full />
    <NCard absolute bottom-3 left-3 border-0 p2 px3 text-sm n-glass-effect>
      <div grid="~ cols-[20px_1fr] items-center gap-y-1">
        <div h-3 w-3 rounded-full bg-hex-42b883 />
        <div op50>
          Component
        </div>
        <div h-3 w-3 rounded-full bg-hex-97c2fc />
        <div op50>
          Global Component
        </div>
        <div h-3 w-3 bg-hex-42b2b8 />
        <div op50>
          Page
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 726 628" ml--1px h-3>
          <path fill="#4256b8" stroke-width="4" d="M723 314 543 625.8H183L3 314 183 2.2h360L723 314z" />
        </svg>
        <div op50>
          Layout
        </div>
        <div h-3 w-3 rounded-full bg-hex-b4b842 />
        <div op50>
          Library Component
        </div>
        <div h-3 w-3 rounded-full bg-hex-b86542 />
        <div op50>
          Unknown
        </div>
      </div>
    </NCard>
    <NDrawer
      :model-value="!!(selected && selected.component)"
      :top="navbar"
      border="t l base" w-80
      @close="selected = undefined"
    >
      <div v-if="selected && selected.component" py4 pt4 flex="~ col">
        <ComponentDetails
          :component="selected.component"
          :dependencies="selectedDependencies"
          :dependents="selectedDependents"
        />
        <div border="t base" p4>
          <NButton n="primary solid" @click="setFilter()">
            Filter to this component
          </NButton>
        </div>
      </div>
    </NDrawer>
  </div>
</template>
