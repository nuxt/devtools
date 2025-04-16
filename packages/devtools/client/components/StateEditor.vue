<script setup lang="ts">
import type { watchPausable } from '@vueuse/core'
import { useVModel } from '@vueuse/core'
import JsonEditorVue from 'json-editor-vue'
import { nextTick, onMounted, shallowRef, watch } from 'vue'
import { getColorMode } from '~/composables/client'

const props = defineProps<{
  name?: string
  open?: boolean
  revision?: number
  state?: any
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const isOpen = useVModel(props, 'open', emit, { passive: true })
const colorMode = getColorMode()
const proxy = shallowRef()
const error = shallowRef()

function isPrimitive(value: any): boolean {
  return ['number', 'bigint', 'string', 'boolean'].includes(typeof value)
}

function clone() {
  error.value = undefined
  try {
    proxy.value = isPrimitive(props.state)
      ? props.state
      : JSON.parse(JSON.stringify(props.state || {}))
  }
  catch (e) {
    console.error(e)
    error.value = e
  }
}

let watcher: ReturnType<typeof watchPausable> | undefined

onMounted(() => {
  clone()

  watch(
    () => [props.revision, props.state],
    ([_, state]) => {
      if (!isPrimitive(state))
        deepSync(state, props.state)
      else
        proxy.value = props.state
    },
    { deep: true },
  )
})

function deepSync(from: any, to: any) {
  for (const key in from) {
    if (Array.isArray(from[key]))
      to[key] = from[key].slice()
    else if (typeof from[key] === 'object' && from[key] !== null)
      deepSync(from[key], to[key])
    else
      to[key] = from[key]
  }
}

async function refresh() {
  watcher?.pause()
  clone()
  await nextTick()
  watcher?.resume()
}
</script>

<template>
  <div class="state-editor-details" :open="!name ? true : isOpen">
    <div
      flex="~ gap2" select-none items-center px4
    >
      <button
        v-if="name" flex="~"
        cursor-pointer items-center
        :class="isOpen ? '' : 'op50'"
        @click="isOpen = !isOpen"
      >
        <div i-carbon-chevron-right transition :class="isOpen ? 'rotate-90 op0' : ''" />
        <code
          px3 py1 font-mono
          :class="isOpen ? 'bg-[#8881] rounded-t' : 'rounded hover:bg-active'"
        >{{ name }}</code>
      </button>
      <slot name="actions" v-bind="{ isOpen, name, state }" />
      <template v-if="isOpen">
        <NButton v-tooltip.bottom="'Refresh View'" title="Refresh View" icon="carbon-renew" :border="false" @click="refresh" />
        <DataSchemaButton
          v-if="proxy && !error"
          :getter="() => ({ name, input: JSON.stringify(proxy) })"
        />
      </template>
    </div>
    <template v-if="isOpen || !name">
      <div v-if="error" class="bg-red:10 px5 py3 text-red">
        Error: {{ error }}
      </div>
      <JsonEditorVue
        v-else
        v-model="proxy"
        v-bind="$attrs"
        class="json-editor-vue"
        :class="[
          colorMode === 'dark' ? 'jse-theme-dark' : '',
          name ? '' : '',
        ]"
        :main-menu-bar="false"
        :navigation-bar="false"
        :status-bar="false"
        :read-only="props.readonly"
        :indentation="2"
        :tab-size="2"
      />
    </template>
  </div>
</template>
