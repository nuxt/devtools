<script setup lang="ts">
import { CodeSnippet } from '~~/../src/types'

const props = defineProps<{
  codeSnippets: CodeSnippet[]
}>()

const selected = shallowRef<CodeSnippet | undefined>(props.codeSnippets[0])

watchEffect(() => {
  if (!props.codeSnippets.includes(selected.value!))
    selected.value = props.codeSnippets[0]
})
</script>

<template>
  <div v-if="codeSnippets.length" relative n-code-block>
    <div flex="~ wrap" w-full>
      <template v-for="cs, idx of codeSnippets" :key="idx">
        <button
          px4 py2 border="r base"
          hover="bg-active"
          :class="cs === selected ? '' : 'border-b'"
          @click="selected = cs"
        >
          <div :class="cs === selected ? '' : 'op30' " font-mono>
            {{ cs.name }}
          </div>
        </button>
      </template>
      <div border="b base" flex-auto />
    </div>

    <template v-if="selected">
      <CodeSnippet :snippet="selected" />
    </template>
  </div>
</template>
