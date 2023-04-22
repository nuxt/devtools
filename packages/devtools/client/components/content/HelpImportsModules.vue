<script setup lang="ts">
const config = useAutoImports()

const modules = computed(() => {
  return [...new Set(config.value?.imports.map(i => getModuleNameFromPath(i.from)).filter(x => Boolean(x) && !isBuiltInModule(x)))]
})
</script>

<template>
  <div flex="~ gap-2 wrap" mb6>
    <code v-for="name of modules" :key="name" rounded bg-primary:5 p="x2 y0.5" text-primary>
      {{ name }}
    </code>
  </div>
</template>
