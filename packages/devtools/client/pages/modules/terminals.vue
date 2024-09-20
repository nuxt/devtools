<script setup lang="ts">
import { definePageMeta } from '#imports'
import { useTerminals } from '~/composables/state'

definePageMeta({
  icon: 'carbon-terminal',
  title: 'Terminals',
  layout: 'full',
  show() {
    const terminals = useTerminals()
    return () => !!terminals.value?.length
  },
  badge() {
    const terminals = useTerminals()
    return () => terminals.value?.filter(i => !i.isTerminated).length
  },
})
</script>

<template>
  <AuthRequiredPanel>
    <TerminalPage />
  </AuthRequiredPanel>
</template>
