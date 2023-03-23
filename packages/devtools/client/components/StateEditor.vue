<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'

const props = defineProps<{
  name?: string
  open?: boolean
  state?: Record<string, any>
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const isOpen = useVModel(props, 'open', emit, { passive: true })

const colorMode = useColorMode()
const proxy = ref()
proxy.value = JSON.parse(JSON.stringify(props.state))

const watcher = watchPausable(proxy,
  (value) => {
    deepSync(value, props.state)
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
        items-center cursor-pointer
        :class="isOpen ? '' : 'op50'"
        @click="isOpen = !isOpen"
      >
        <div transition i-carbon-chevron-right :class="isOpen ? 'rotate-90 op0' : ''" />
        <code
          font-mono py1 px3
          :class="isOpen ? 'bg-[#8881] rounded-t' : 'rounded hover:bg-active'"
        >{{ name }}</code>
      </button>
      <slot name="actions" v-bind="{ isOpen, name, state }" />
      <template v-if="isOpen">
        <NIconButton title="Refresh View" icon="carbon-renew" @click="refresh" />
      </template>
    </div>
    <template v-if="isOpen || !name">
      <JsonEditorVue
        v-if="state && Object.keys(state).length > 0"
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
      <div v-else italic p5 bg-active>
        <span op50>No data</span>
      </div>
    </template>
  </div>
</template>
