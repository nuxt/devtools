<script setup lang="ts">
import type { Component } from '@nuxt/schema'
import type { Data, Node, Options } from 'vis-network'
import { Network } from 'vis-network'

const props = defineProps<{
  components: Component[]
}>()

const container = ref<HTMLElement>()
const colorMode = useColorMode()

const pages = useServerPages()
const layouts = useLayouts()
const relationships = useComponentsRelationships()

const {
  componentsGraphShowNodeModules: showNodeModules,
  componentsGraphShowPages: showPages,
  componentsGraphShowLayouts: showLayouts,
} = devToolsSettingsRefs

const data = computed<Data>(() => {
  const relations = (relationships.value || [])
  const nodes: Data['nodes'] = relations.map((rel): Node | null => {
    const component = props.components.find(i => i.filePath === rel.id)
    const page = pages.value?.find(i => i.file === rel.id)
    const layout = layouts.value?.find(i => i.file === rel.id)

    const path = rel.id.replace(/\?.*$/, '').replace(/\#.*$/, '')
    const group = component
      ? 'user'
      : layout
        ? 'layout'
        : page
          ? 'page'
          : rel.id.includes('node_modules')
            ? 'lib'
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
    }
  }).filter((x): x is Node => !!x)

  const edges: Data['edges'] = relations.flatMap(rel => rel.deps.map(dep => ({
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

  // network.on('click', (data) => {
  //   const node = data.nodes?.[0]
  //   if (node)
  //     router.push(`/module?id=${encodeURIComponent(node)}`)
  // })

  watch(data, () => {
    network.setData(data.value)
  })
})
</script>

<template>
  <div h-full flex="~ col">
    <div border="b base" flex="~ gap4" py2 px4>
      <NCheckbox v-model="showPages" n="primary sm">
        <span op75>Show pages</span>
      </NCheckbox>
      <NCheckbox v-model="showLayouts" n="primary sm">
        <span op75>Show layouts</span>
      </NCheckbox>
      <NCheckbox v-model="showNodeModules" n="primary sm">
        <span op75>Show node_modules</span>
      </NCheckbox>
    </div>
    <div ref="container" class="w-full h-full" />
  </div>
</template>
