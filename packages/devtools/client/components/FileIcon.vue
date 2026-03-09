<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ id?: string }>()

const DOT_RE = /\./g

const ext = computed(() => props.id?.split(DOT_RE).pop() || '')
const icon = computed(() => {
  switch (ext.value) {
    case 'vue':
      return 'logos-vue'
    default:
      return 'carbon-document-blank'
  }
})
</script>

<template>
  <div :class="icon" />
</template>
