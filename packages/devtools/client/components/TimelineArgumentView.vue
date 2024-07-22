<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'

const props = defineProps<{
  value: any
}>()

const clone = ref<any>()
const error = ref<any>()

function doClone() {
  try {
    clone.value = JSON.parse(JSON.stringify(props.value))
  }
  catch (e) {
    console.error(e)
    error.value = e
  }
}

const OnSetup = defineComponent({
  emits: ['setup'],
  setup(_, { emit }) {
    emit('setup')
    return () => null
  },
})

const colorMode = getColorMode()
const copy = useCopy()
</script>

<template>
  <div v-if="(typeof value === 'string')" text-blue>
    {{ JSON.stringify(value) }}
  </div>
  <div v-else-if="(typeof value === 'number')" text-purple>
    {{ value }}
  </div>
  <div v-else-if="(typeof value === 'boolean')" text-green>
    {{ value }}
  </div>
  <div v-else-if="(typeof value === 'undefined')" text-gray>
    undefined
  </div>
  <div v-else-if="(typeof value === 'function')" text-gray>
    [Function{{ value.name ? `: ${value.name}` : '' }}]
  </div>
  <div v-else-if="value === null" text-gray>
    null
  </div>
  <template v-else>
    <VMenu placement="top">
      <span
        rounded-sm px1 py0.5 text-sm
        :class="[
          Array.isArray(value) ? 'text-amber bg-amber:10' : 'text-orange bg-orange:10',
        ]"
      >
        {{ Array.isArray(value) ? `[Array(${value.length})]` : `[Object]` }}
      </span>
      <template #popper>
        <OnSetup @setup="doClone" />
        <div v-if="error" bg-red:10 px2 py1 text-red>
          Failed to display object: {{ error }}
        </div>
        <div v-else-if="clone">
          <JsonEditorVue
            :model-value="clone"
            v-bind="$attrs"
            class="json-editor-vue"
            :class="[
              colorMode === 'dark' ? 'jse-theme-dark' : '',
            ]"
            :main-menu-bar="false"
            :navigation-bar="false"
            :status-bar="false"
            :read-only="true"
            :indentation="2"
            :tab-size="2"
          />
          <div p2 text-sm border="t base">
            <NButton
              title="Copy to clipboard"
              icon="carbon-copy"
              @click="copy(JSON.stringify(clone, null, 2), 'timeline-argument')"
            >
              Copy
            </NButton>
          </div>
        </div>
      </template>
    </VMenu>
  </template>
</template>
