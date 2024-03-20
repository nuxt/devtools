<script setup lang="ts">
import type { BuiltinLanguage } from 'shiki'
import type { CodeSnippet } from '../../types'

const props = defineProps<{
  codeSnippets: CodeSnippet[]
  eventType?: string
}>()

const selected = shallowRef<CodeSnippet | undefined>(props.codeSnippets[0])
const copy = useCopy()

const selectedLang = computed(() => (selected.value?.lang || 'text') as BuiltinLanguage)

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
        :lang="selectedLang"
        :lines="false"
        w-full of-auto p3
      />
      <div flex="~ gap-2" px3 pb3 n="sm primary">
        <NButton
          icon="carbon-copy"
          @click="copy(selected!.code, eventType || `code-snippet-${selected.name}`)"
        >
          Copy
        </NButton>
        <NButton
          v-if="selected?.docs" :to="selected.docs" target="_blank"
          icon="carbon-catalog"
        >
          Docs
        </NButton>
      </div>
    </template>
  </div>
</template>
