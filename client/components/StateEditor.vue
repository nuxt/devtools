<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'

const props = defineProps<{
  state?: Record<string, any>
  readonly?: boolean
}>()

const colorMode = useColorMode()
const proxy = ref()
proxy.value = JSON.parse(JSON.stringify(props.state))

watch(proxy,
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
</script>

<template>
  <JsonEditorVue
    v-if="state && Object.keys(state).length > 0"
    v-model="proxy"
    v-bind="$attrs"
    class="json-editor-vue"
    :class="colorMode.value === 'dark' ? 'jse-theme-dark' : ''"
    :main-menu-bar="false"
    :navigation-bar="false"
    :status-bar="false"
    :read-only="readonly"
    :indentation="2"
    :tab-size="2"
  />
  <div v-else mt2 italic op35>
    No data
  </div>
</template>

<style>
.json-editor-vue {
  --jse-theme-color: #383e42 !important;
  --jse-theme-color-highlight: #687177 !important;
}

.json-editor-vue .no-main-menu {
  border: none !important;
}

.json-editor-vue .jse-main {
  min-height: 1em !important;
}

.json-editor-vue .jse-contents {
  border-width: 0 !important;
  border-radius: 5px !important;
}
</style>
