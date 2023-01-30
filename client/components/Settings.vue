<script setup lang="ts">
const settings = devToolsSettings
</script>

<template>
  <div px4 py3 flex="~ col gap2">
    <NCheckbox v-model="settings.customTabs" n-primary>
      <span op75>Show custom tabs</span>
    </NCheckbox>
  </div>
</template>
