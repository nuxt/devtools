<script setup lang="ts">
// This components requires to run in DevTools to render correctly
import { computed, nextTick } from 'vue'
import type { BuiltinLanguage } from 'shiki'
import { devToolsClient } from '../runtime/client'

const props = withDefaults(
  defineProps<{
    code: string
    lang?: BuiltinLanguage | 'text'
    lines?: boolean
    transformRendered?: (code: string) => string
  }>(),
  {
    lines: true,
  },
)

const emit = defineEmits(['loaded'])

const rendered = computed(() => {
  const result = props.lang === 'text'
    ? { code: props.code, supported: false }
    : devToolsClient.value?.devtools.renderCodeHighlight(props.code, props.lang) || { code: props.code, supported: false }
  if (result.supported && props.transformRendered)
    result.code = props.transformRendered(result.code)
  if (result.supported)
    nextTick(() => emit('loaded'))
  return result
})
</script>

<template>
  <template v-if="lang && rendered.supported">
    <pre
      class="n-code-block"
      :class="lines ? 'n-code-block-lines' : ''"
      v-html="rendered.code"
    />
  </template>
  <template v-else>
    <pre
      class="n-code-block"
      :class="lines ? 'n-code-block-lines' : ''"
    ><pre class="shiki"><code><template v-for="line, _idx in code.split('\n')" :key="_idx"><span class="line" v-text="line" /><br></template></code></pre></pre>
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
  width: 2.5rem;
  padding-right: 0.5rem;
  margin-right: 0.5rem;
  display: inline-block;
  text-align: right;
  --at-apply: text-truegray: 50;
}
</style>
