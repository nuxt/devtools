<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'

const props = defineProps<{
  name?: string
  open?: boolean
  state?: any
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const isOpen = useVModel(props, 'open', emit, { passive: true })
const colorMode = useColorMode()
const proxy = ref()

const state = useState(props.name)
if (props.state)
  proxy.value = JSON.parse(JSON.stringify(props.state))
else if (typeof props.state === 'number' || typeof props.state !== 'string')
  proxy.value = props.state

const watcher = watchPausable(
  proxy,
  (value) => {
    if (typeof value !== 'number' && typeof value !== 'string')
      deepSync(value, props.state)
    else
      state.value = value
  },
  { deep: true },
)

function deepSync(from: any, to: any) {
  for (const key in from) {
    if (from[key] === null)
      to[key] = null
    else if (Array.isArray(from[key]))
      to[key] = from[key].slice()
    else if (typeof from[key] === 'object')
      deepSync(from[key], to[key])
    else
      to[key] = from[key]
  }
}

async function refresh() {
  watcher.pause()
  proxy.value = JSON.parse(JSON.stringify(props.state))
  await nextTick()
  watcher.resume()
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
        <NIconButton v-tooltip.bottom="'Refresh View'" title="Refresh View" icon="carbon-renew" @click="refresh" />
        <DataSchemaButton
          v-if="proxy"
          :getter="() => ({ name, input: JSON.stringify(proxy) })"
        />
      </template>
    </div>
    <template v-if="isOpen || !name">
      <JsonEditorVue
        v-model="proxy"
        v-bind="$attrs"
        class="json-editor-vue"
        :class="[
          colorMode.value === 'dark' ? 'jse-theme-dark' : '',
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
