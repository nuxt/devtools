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
  <div v-if="codeSnippets.length" n-code-block relative>
    <div flex="~ wrap" w-full>
      <template v-for="cs, idx of codeSnippets" :key="idx">
        <button
          p2 border="r base"
          hover="bg-active"
          :class="cs === selected ? 'bg-active' : ''"
          @click="selected = cs"
        >
          <div :class="cs === selected ? '' : 'op50' ">
            {{ cs.name }}
          </div>
        </button>
      </template>
      <div flex-auto />
      <NButton v-if="selected?.docs" :to="selected.docs" target="_blank" icon="carbon-help" n="sm primary" border="none" my1 px-2>
        Docs
      </NButton>
      <NButton v-if="selected" icon="carbon-copy" n="sm primary" border="none" px-2 my1 mr1 @click="copy(selected!.code)">
        Copy
      </NButton>
    </div>

    <div x-divider />
    <template v-if="selected">
      <NCodeBlock
        :code="selected.code"
        :lang="selected.lang"
        :lines="false"
        w-full of-auto p3
      />
    </template>
  </div>
</template>
