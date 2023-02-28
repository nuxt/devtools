<script setup lang="ts">
// This components requires to run in DevTools to render correctly

import { devToolsClient } from './_utils/client'

defineProps<{
  code: string
  lang?: string
}>()
</script>

<template>
  <template v-if="lang && devToolsClient?.devtools?.renderCodeHighlight">
    <pre class="n-code-block" v-html="devToolsClient.devtools.renderCodeHighlight(code, lang)" />
  </template>
  <template v-else>
    <pre class="n-code-block" v-text="code" />
  </template>
</template>
