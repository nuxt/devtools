<script setup lang="ts">
import NIcon from './NIcon.vue'
import NuxtLogo from './NuxtLogo.vue'
import NuxtContentLogo from './NuxtContentLogo.vue'

interface Props {
  example?: string
  showTips?: boolean
  class?: string
  openPath?: string
  repo?: string
}
const props = withDefaults(defineProps<Props>(), {
  repo: 'nuxt/framework',
})

const openInEditor = () => {
  fetch(`/__open-in-editor?file=${encodeURIComponent(props.openPath || 'app.vue')}`)
}
</script>

<template>
  <div class="relative font-sans" n="green6">
    <div class="container mx-auto px-4 max-w-200 py-10">
      <div class="flex flex-wrap items-end gap-3 relative mb-4">
        <slot name="logo">
          <NuxtContentLogo v-if="repo === 'nuxt/content'" class="h-6" />
          <NuxtLogo v-else class="h-6" />
        </slot>
        <div flex-auto />
        <div class="op20 n-transition hover:op-100 -mb-2 -mr-1">
          <NButton
            n="borderless lg"
            class="op50 p-2"
            :to="`https://github.com/${repo}/tree/main/examples/${example}`"
            target="_blank"
          >
            <NIcon icon="carbon-code" />
          </NButton>
          <NDarkToggle>
            <template #default="{ toggle }">
              <NButton n="borderless lg" p-2 op50 @click="toggle">
                <NIcon icon="dark:carbon-moon carbon-sun" />
              </NButton>
            </template>
          </NDarkToggle>
        </div>
      </div>

      <slot name="subtitle" />
      <slot name="nav" />

      <NCard class="flex flex-col gap-2 text-center p-6" :class="$props.class">
        <slot />
      </NCard>

      <div
        v-if="$slots.tips"
        :class="showTips ? 'opacity-100' : 'opacity-0'"
        class="transition flex items-center gap-2 text-gray-400 py-5"
      >
        <NIcon icon="carbon-idea" class="text-xl flex-none" />
        <slot name="tips" />
        <NButton icon="carbon-edit" class="flex-none" @click="openInEditor">
          Open in Editor
        </NButton>
      </div>

      <slot name="footer" />
    </div>
  </div>
</template>
