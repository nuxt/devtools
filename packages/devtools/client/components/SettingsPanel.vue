<script setup lang="ts">
const {
  interactionCloseOnOutsideClick,
} = useDevToolsSettings()
</script>

<template>
  <div px4 py2 flex="~ col">
    <NCheckbox v-model="interactionCloseOnOutsideClick" n-primary>
      <span>Close DevTools when clicking outside</span>
    </NCheckbox>
  </div>
</template>
