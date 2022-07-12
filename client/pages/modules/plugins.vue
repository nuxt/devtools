<script setup lang="ts">
import { config } from '#imports'

definePageMeta({
  icon: 'carbon-plug',
  title:'Plugins',
})
</script>

<template>
  <div>
    <SectionBlock
      icon="carbon-plug"
      text="Plugins"
    >
      <pre>{{ config.plugins.map(i => typeof i === 'string' ? i : i.src) }}</pre>
    </SectionBlock>
  </div>
</template>
