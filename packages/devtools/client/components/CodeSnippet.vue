<script setup lang="ts">
import type { CodeSnippet } from '~~/../src/types'

defineProps<{
  snippet: CodeSnippet
}>()

const copy = useCopy()
</script>

<template>
  <div>
    <NCodeBlock
      :code="snippet.code"
      :lang="snippet.lang"
      :lines="false"
      w-full of-auto p3
    />
    <div flex="~ gap-2" px3 pb3 n="sm primary">
      <NButton
        icon="carbon-copy"
        @click="copy(snippet!.code)"
      >
        Copy
      </NButton>
      <NButton
        v-if="snippet?.docs" :to="snippet.docs" target="_blank"
        icon="carbon-catalog"
      >
        Docs
      </NButton>
    </div>
  </div>
</template>
