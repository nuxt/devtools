<script setup lang="ts">
import type { Component } from '@nuxt/schema'
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'carbon-nominal',
  title: 'Components',
})

const client = useClient()
const router = useRouter()
const serverComponents = (await rpc.getComponents())
  .sort((a, b) => a.pascalName.localeCompare(b.pascalName))

const globalComponents = $computed(() =>
  Object
    .entries(client.value?.nuxt?.vueApp._context.components || {})
    .map(([key]) => ({
      pascalName: key,
      global: true,
    } as unknown as Component)),
)

const components = $computed(() => [
  ...globalComponents,
  ...serverComponents,
].sort((a, b) => a.pascalName.localeCompare(b.pascalName)))

const fuse = $computed(() => new Fuse(components, {
  keys: [
    'pascalName',
    'filePath',
    'kebabName',
  ],
}))

const search = $ref('')

const filtered = $computed(() => {
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

  const result = search
    ? fuse.search(search).map(i => i.item)
    : components

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

function openComponentInspector() {
  if (!client.value?.componentInspector)
    return
  client.value.enableComponentInspector()
  router.push('/inspecting')
}
</script>

<template>
  <div h-full grid="~ rows-[max-content_1fr]">
    <div p4 flex="~ gap4" flex-1 border="b base">
      <NTextInput
        v-model="search"
        placeholder="Search..."
        p="x4 y2"
        n="primary"
        flex-auto
      />
      <button
        v-if="client?.componentInspector"
        title="Inspect Vue components"
        @click="openComponentInspector"
      >
        <NIcon icon="i-carbon-map-identify" />
      </button>
    </div>
    <div h-full of-auto>
      <SectionBlock
        v-if="filtered.user.length"
        icon="carbon-nominal"
        text="User components"
        :description="`Total components: ${filtered.count.user}`"
      >
        <ComponentItem v-for="c of filtered.user" :key="c.filePath" :component="c" />
      </SectionBlock>
      <SectionBlock
        v-if="filtered.runtime.length"
        icon="i-carbon-load-balancer-global"

        text="Runtime components"
        :description="`Total components: ${filtered.count.runtime}`"
      >
        <ComponentItem v-for="c of filtered.runtime" :key="c.filePath" :component="c" />
      </SectionBlock>
      <SectionBlock
        v-if="filtered.builtin.length"
        icon="tabler-brand-nuxt"
        text="Built-in components"
        :description="`Total components: ${filtered.count.builtin}`"
      >
        <ComponentItem v-for="c of filtered.builtin" :key="c.filePath" :component="c" />
      </SectionBlock>
      <SectionBlock
        v-if="filtered.lib.size"
        icon="carbon-3d-mpr-toggle"
        text="Components from libraries"
        :description="`${filtered.count.lib} components from ${filtered.lib.size} packages`"
      >
        <div v-for="[key, value] of filtered.lib.entries()" :key="key">
          <IconTitle :text="`${key} (${value.length})`" op50 py1 />
          <div pl4>
            <ComponentItem v-for="c of value" :key="c.filePath" :component="c" />
          </div>
        </div>
      </SectionBlock>
    </div>
  </div>
</template>
