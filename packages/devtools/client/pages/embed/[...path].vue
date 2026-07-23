<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from '#app/composables/router'
import { definePageMeta } from '#imports'

definePageMeta({
  layout: 'none',
})

const route = useRoute()
const router = useRouter()

// The catch-all carries the target tab route, e.g. `modules/components` or
// `modules/custom-foo`.
const targetPath = computed(() => {
  const segments = route.params.path
  const parts = Array.isArray(segments) ? segments : [segments]
  return `/${parts.filter(Boolean).join('/')}`
})

const resolved = computed(() => router.resolve(targetPath.value))
// Custom tabs share a single dynamic route; the page reads its tab from a
// `name` prop, so pass the resolved param through.
const customName = computed(() =>
  resolved.value.name === 'modules-custom-name' ? String(resolved.value.params.name) : undefined,
)

// Mount the target route's own component directly (same approach as
// SplitScreen) instead of navigating, so the tab renders without the shell.
const PageComponent = shallowRef()
watch(resolved, (r) => {
  const component = r.matched[r.matched.length - 1]?.components?.default
  PageComponent.value = typeof component === 'function'
    ? defineAsyncComponent(component as any)
    : component
}, { immediate: true })
</script>

<template>
  <div h-screen w-full of-auto bg-base>
    <component :is="PageComponent" v-if="PageComponent && customName" :key="`custom-${customName}`" :name="customName" />
    <component :is="PageComponent" v-else-if="PageComponent" :key="targetPath" />
    <NPanelGrids v-else>
      <span text-lg op50>Tab not found</span>
    </NPanelGrids>
  </div>
</template>
