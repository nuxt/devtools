<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'

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

function clone() {
  error.value = undefined
  try {
    if (props.state)
      proxy.value = JSON.parse(JSON.stringify(props.state || {}))
    else if (typeof props.state === 'number' || typeof props.state !== 'string')
      proxy.value = props.state
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
    (value) => {
      if (typeof value !== 'number' && typeof value !== 'string')
        deepSync(value, props.state)
      else
        proxy.value = props.state
    },
    { deep: true },
  )
})

function deepSync(from: any, to: any) {
  // const fromRevision = from[0]
  const fromValue = from[1]
  for (const key in fromValue) {
    if (Array.isArray(fromValue[key]))
      to[key] = fromValue[key].slice()
    else if (typeof fromValue[key] === 'object')
      deepSync(fromValue[key], to[key])
    else
      to[key] = fromValue[key]
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
        :read-only="readonly"
        :indentation="2"
        :tab-size="2"
      />
    </template>
  </div>
</template>
