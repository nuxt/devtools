<script setup lang="ts">
const props = defineProps<{
  example?: string
  showTips?: boolean
  class?: string
  openPath?: string
}>()

const openInEditor = () => {
  fetch(`/__open-in-editor?file=${encodeURIComponent(props.openPath || 'app.vue')}`)
}
</script>

<template>
  <div class="relative font-sans" n="green6">
    <div class="container max-w-200 mx-auto py-10 px-4">
      <div class="flex flex-col gap-2 items-center mb-4">
        <img src="../assets/logo-nuxt3.svg" h="12">
        <div class="text-xl flex">
          <div class="op-50">
            examples/
          </div>
          <slot name="name">
            <NLink :href="`https://github.com/nuxt/framework/tree/main/examples/${example}`" target="_blank">
              {{ example }}
            </NLink>
          </slot>
        </div>
        <slot name="subtitle" />
      </div>

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
