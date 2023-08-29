<script setup lang="ts">
import type { Component } from 'nuxt/schema'
import { pascalCase } from 'scule'
import type { Options } from 'vis-network'
import { Network } from 'vis-network'

const props = defineProps<{
  component: Component
  isUserComponent?: boolean
  dependencies?: string[]
  dependents?: string[]
}>()

// @ts-expect-error types
const name = computed(() => props.component.pascalName || pascalCase(props.component.name || props.component.__name || props.component.kebabName || ''))
// @ts-expect-error types
const filePath = computed(() => props.component.filePath || props.component.file || props.component.__file || '')
const copy = useCopy()

const networkRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  const visOption: Options = {
    physics: {
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        gravitationalConstant: -50,
      },
    },
    groups: {
      used: {
        color: {
          border: '#3d7de4',
          background: '#9dc2f9',
          highlight: {
            border: '#3d7de4',
            background: '#9dc2f9',
          },
        },
      },
      normal: {
        color: {
          border: '#ccc',
          background: '#ddd',
          highlight: {
            border: '#ccc',
            background: '#ddd',
          },
        },
      },
    },
  }

  if (filePath.value) {
    const data = await rpc.getComponentGraph(filePath.value)
    if (data) {
      nextTick(() => {
        const network = new Network(networkRef.value!, data, visOption)
      })
    }
  }
})
</script>

<template>
  <div flex="~ gap2">
    <div flex="~ col gap1 1" items-start of-hidden>
      <div flex="~ gap2" px3>
        <ComponentName :component="component" />
        <NIconButton title="Copy name" flex-none icon="carbon-copy" @click="copy(`<${name}></${name}>`)" />
        <Badge
          v-if="component.global"
          bg-green-400:10 text-green-400
          title="Registered at runtime as a global component"
          v-text="'runtime'"
        />
      </div>
      <div px3 pb2>
        <FilepathItem
          v-if="filePath"
          :filepath="filePath"
          w-full text-sm op40 group-hover:op75
        />
      </div>

      <div v-if="dependents" border="t base" max-h-60 w-full of-auto px3 py3>
        <div text-sm>
          <strong text-primary>{{ dependents.length }}</strong><span op50> references</span>
        </div>
        <div v-if="dependents.length" flex="~ col gap-2" items-start pt3 text-sm op75>
          <FilepathItem
            v-for="id of dependents" :key="id"
            :filepath="id"
          />
        </div>
      </div>

      <div v-if="dependencies" border="t base" max-h-60 w-full of-auto px3 py3>
        <div text-sm>
          <strong text-primary>{{ dependencies.length }}</strong><span op50> dependencies</span>
        </div>
        <div v-if="dependencies.length" flex="~ col gap-2" items-start pt3 text-sm op75>
          <FilepathItem
            v-for="id of dependencies" :key="id"
            :filepath="id"
          />
        </div>
      </div>

      <slot />
    </div>
    <div v-if="isUserComponent" relative flex="~ 1" h-full w-full>
      <div ref="networkRef" h-full w-full />
      <NCard
        class="absolute right-[10px] top-[10px] flex flex-col gap-1 border-0 p-1 p2 px3 text-xs glass-effect"
      >
        <div class="flex items-center align-baseline">
          <div
            class="mr-1 inline-block h-[10px] w-[10px] border border-[#3d7de4] border-solid bg-[#9dc2f9]"
          />
          <span>USED IN TEMPLATE</span>
        </div>
        <div class="flex items-center align-baseline">
          <div
            class="mr-1 inline-block h-[10px] w-[10px] border border-[#ddd] border-solid bg-[#eee]"
          />
          <span>NOT USED IN TEMPLATE</span>
        </div>
        <div class="flex items-center align-baseline">
          <div
            class="mr-1 inline-block h-[10px] w-[10px] border border-[#333] rounded-full border-solid"
          />
          <span>Variant</span>
        </div>
        <div class="flex items-center align-baseline">
          <div
            class="mr-1 inline-block h-[10px] w-[10px] rotate-45 scale-80 transform border border-[#333] border-solid"
          />
          <span>Function</span>
        </div>
      </NCard>
    </div>
  </div>
</template>
