<script setup lang="ts">
const client = useClient()

const path = $computed(() => client.value?.nuxt?.vueApp.config.globalProperties.$route.path)
const matched = $computed(() => [...client.value?.nuxt?.vueApp.config.globalProperties.$route.matched || []])
const config = useServerConfig()
</script>

<template>
  <div flex="~ col gap-2">
    <div text-lg>
      Route path
    </div>
    <code op75 px2 py1 border="~ base rounded">{{ path }}</code>
    <div text-lg>
      Matched routes
    </div>
    <div>
      <template v-for="i, idx of matched" :key="idx">
        <ComponentItem v-if="i.components?.default" :component="i.components?.default as any" />
      </template>
    </div>
  </div>
</template>
