<script setup lang="ts">
import { useVModel, watchDebounced } from '@vueuse/core'
import JsonEditorVue from 'json-editor-vue'
import { computed, onMounted, shallowRef } from 'vue'
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

// A named editor is collapsible; only the visible ones need a fresh snapshot.
const isVisible = computed(() => !props.name || !!isOpen.value)

function isPrimitive(value: any): boolean {
  return ['number', 'bigint', 'string', 'boolean'].includes(typeof value)
}

// Produce a plain, non-reactive snapshot of the state for the JSON editor.
//
// This must NEVER mutate `props.state`: it is the live reactive Nuxt payload /
// app config / `useState` data. The previous implementation deep-synced the
// state back into itself under a `{ deep: true }` watcher, so any array or
// nested object endlessly re-triggered the watcher and froze the whole page
// (nuxt/devtools#972). Re-cloning into a detached `proxy` avoids that entirely.
function clone() {
  error.value = undefined
  if (!isVisible.value)
    return
  try {
    proxy.value = isPrimitive(props.state)
      ? props.state
      : JSON.parse(JSON.stringify(props.state ?? {}))
  }
  catch (e) {
    console.error(e)
    error.value = e
  }
}

onMounted(clone)

// `revision` is bumped by DevTools whenever host reactivity updates, so it is a
// sufficient change signal — we don't need (and must not use) a deep watcher on
// the potentially huge state object. Debounced to avoid thrashing on rapid
// updates.
watchDebounced(
  () => [props.revision, props.state, isVisible.value],
  clone,
  { debounce: 100, maxWait: 500 },
)

function refresh() {
  clone()
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
