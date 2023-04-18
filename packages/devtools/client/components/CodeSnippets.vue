<script setup lang="ts">
import type { CodeSnippet } from '~~/../src/types'

const props = defineProps<{
  codeSnippets: CodeSnippet[]
}>()

const selected = shallowRef<CodeSnippet | undefined>(props.codeSnippets[0])
const copy = useCopy()

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
      <NCodeBlock
        :code="selected.code"
        :lang="selected.lang"
        :lines="false"
        w-full of-auto p3
      />
      <div flex="~ gap-2" px3 pb2>
        <NButton
          icon="carbon-copy" n="sm primary"
          my1 px-3 @click="copy(selected!.code)"
        >
          Copy
        </NButton>
        <NButton
          v-if="selected?.docs" :to="selected.docs" target="_blank"
          icon="carbon-catalog" n="sm primary"
          my1 px-3
        >
          Docs
        </NButton>
      </div>
    </template>
  </div>
</template>
