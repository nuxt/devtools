<script setup lang="ts">
const client = useClient()

const path = computed(() => client.value?.nuxt?.vueApp.config.globalProperties.$route.path)
</script>

<template>
  <div flex="~ col gap-2">
    <div text-lg>
      Route path
    </div>
    <code px2 py1 op75 border="~ base rounded">{{ path }}</code>
  </div>
</template>
