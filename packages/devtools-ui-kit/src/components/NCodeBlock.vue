<script setup lang="ts">
// This components requires to run in DevTools to render correctly
import { devToolsClient } from '../runtime/client'

const props = withDefaults(
  defineProps<{
    code: string
    lang?: string
    lines?: boolean
  }>(), {
    lines: true,
  },
)
// @ts-expect-error types
const parseCode = computed(() => {
  const code = devToolsClient.value?.devtools.renderCodeHighlight(props.code, props.lang as string)
  return {
    code,
    styleStatus: code?.startsWith('<pre'),
  }
})
</script>

<template>
  <template v-if="lang && devToolsClient?.devtools?.renderCodeHighlight">
    <pre
      class="n-code-block" :class="lines ? 'n-code-block-lines' : ''"
      v-html="parseCode.code"
    />
    <NLoading v-if="!parseCode.styleStatus" />
  </template>
  <template v-else>
    <pre class="n-code-block" :class="lines ? 'n-code-block-lines' : ''" v-text="code" />
  </template>
</template>

<style>
.n-code-block-lines .shiki code {
  counter-reset: step;
  counter-increment: step calc(var(--start, 1) - 1);
}
.n-code-block-lines .shiki code .line::before {
  content: counter(step);
  counter-increment: step;
  width: 2rem;
  padding-right: 0.5rem;
  margin-right: 0.5rem;
  display: inline-block;
  text-align: right;
  --at-apply: text-truegray:50;
}
</style>
