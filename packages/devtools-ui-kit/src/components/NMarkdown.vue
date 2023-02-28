<script setup lang="ts">
// This components requires to run in DevTools to render correctly

import { devToolsClient } from '../runtime/client'

defineProps<{
  markdown: string
  tag?: string
}>()
</script>

<template>
  <template v-if="markdown && devToolsClient?.devtools?.renderMarkdown">
    <component :is="tag || 'span'" class="n-markdown" v-html="devToolsClient.devtools.renderMarkdown(markdown)" />
  </template>
  <template v-else>
    <component :is="tag || 'span'" class="n-markdown" v-text="markdown" />
  </template>
</template>
