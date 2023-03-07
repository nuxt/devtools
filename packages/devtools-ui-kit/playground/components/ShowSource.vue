<script setup lang="ts">
const props = defineProps({
  src: String,
})
const show = ref(false)
const embed = ref<HTMLElement>()
const repo = 'https://github.com/nuxt/devtools/tree/main/packages/devtools-ui-kit'
const url = computed(() => `https://emgithub.com/embed-v2.js?target=${encodeURIComponent(repo + props.src)}&style=default&type=code&showFullPath=on&showFileMeta=on&showCopy=on`)

watch(show, async () => {
  if (show.value) {
    await nextTick()
    const script = document.createElement('script')
    script.src = url.value
    embed.value?.appendChild(script)
  }
})
</script>

<template>
  <div class="mt-2">
    <span n="xs" class="cursor-pointer text-gray n-link n-link-base hover:n-link-hover n-transition" @click="show = !show">
      {{ show ? 'Hide' : 'Show' }} source
    </span>
    <div v-if="show" ref="embed" class="dark:filter-invert-100" />
  </div>
</template>
