<script setup lang="ts">
import NIcon from './NIcon.vue'
import NuxtLogo from './NuxtLogo.vue'
import NuxtContentLogo from './NuxtContentLogo.vue'

interface Props {
  example?: string
  showTips?: boolean
  class?: string // eslint-disable-line vue/no-reserved-props
  openPath?: string,
  repo?: string
}
const props = withDefaults(defineProps<Props>(), {
  repo: 'nuxt/framework'
})

const openInEditor = () => {
  fetch(`/__open-in-editor?file=${encodeURIComponent(props.openPath || 'app.vue')}`)
}
</script>

<template>
  <div class="relative font-sans" n="green6">
    <div class="container max-w-200 mx-auto py-10 px-4">
      <div class="flex items-end gap-3 mb-4 relative">
        <slot name="logo">
          <NuxtContentLogo v-if="repo === 'nuxt/content'" class="h-10" />
          <NuxtLogo v-else class="h-10" />
        </slot>
        <div class="text-xl flex">
          <div class="op-50">
            examples/
          </div>
          <slot name="name">
            <NLink :href="`https://github.com/${repo}/tree/main/examples/${example}`" target="_blank">
              {{ example }}
            </NLink>
          </slot>
        </div>
        <div flex-auto />
        <div class="op20 hover:op-100 n-transition -mb-2 -mr-1">
          <NButton
            n="borderless lg"
            class="p-2 op50"
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

      <NCard class="p-6 flex flex-col gap-2 text-center" :class="$props.class">
        <slot />
      </NCard>

      <div
        v-if="$slots.tips"
        :class="showTips ? 'opacity-100' : 'opacity-0'"
        class="transition py-5 flex items-center gap-2 text-gray-400"
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
