<script setup lang="ts">
const imports = useAutoImports()
</script>

<template>
  <div v-if="imports?.dirs" flex="~ col gap-2 items-start">
    <template v-for="dir of imports.dirs" :key="dir">
      <FilepathItem :filepath="dir" text-primary />
    </template>
  </div>
</template>
