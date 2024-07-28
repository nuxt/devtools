<script setup lang="ts">
import { InputData, jsonInputForTargetLanguage, quicktype } from 'quicktype-core'
import { all as languages } from 'quicktype-core/dist/language/All'
import type { BuiltinLanguage } from 'shiki'

const input = useSchemaInput()

const counter = ref(0)

// TODO: use localStorage
const selectedLang = ref('TypeScript')
const language = computed(() => languages.find(l => l.displayName === selectedLang.value))
// TODO: use localStorage
const options = ref(language.value?.optionDefinitions.filter(o => typeof o.defaultValue === 'boolean'))

const generatedJson = computedAsync(async () => {
  // eslint-disable-next-line ts/no-unused-expressions
  counter.value

  if (!input.value)
    return ''

  const jsonInput = jsonInputForTargetLanguage(selectedLang.value)

  await jsonInput.addSource({
    // TODO: input for custom name
    name: input.value.name ?? 'Data',
    samples: [input.value.input],
  })

  const inputData = new InputData()
  inputData.addInput(jsonInput)

  const result = await quicktype({
    inputData,
    lang: selectedLang.value,
    rendererOptions: options.value?.reduce((acc: any, cur: any) => {
      acc[cur.name] = cur.defaultValue
      return acc
    }, {} as any),
  })

  return result.lines.join('\n')
})

const shikiLanguage = computed<BuiltinLanguage>(() => {
  const lang = selectedLang.value.toLocaleLowerCase()
  if (lang.startsWith('javascript'))
    return 'javascript'
  else if (lang.startsWith('json'))
    return 'json'
  else if (lang.startsWith('typescript'))
    return 'typescript'
  else
    return lang as BuiltinLanguage
})

watch(options, () => {
  counter.value++
}, { deep: true })

watch(selectedLang, () => {
  options.value = language.value?.optionDefinitions.filter(o => typeof o.defaultValue === 'boolean')
})

const copy = useCopy()

function copyToClipboard() {
  copy(generatedJson.value)
}
</script>

<template>
  <Teleport v-if="language" to="body">
    <NDrawer :model-value="!!input?.input" auto-close max-w-screen w-2xl n-code-block @close="input = null">
      <div border="b base" flex="~ items-center gap-2" sticky left-0 right-0 top-0 z-1 p3 bg-base>
        <p mr-2>
          Schema
        </p>
        <NSelect v-model="selectedLang" n="xs primary">
          <option v-for="lang of languages" :key="lang.displayName">
            {{ lang.displayName }}
          </option>
        </NSelect>
        <NDropdown v-if="options?.length" n="sm lime">
          <template #trigger="{ click }">
            <NButton icon="carbon-settings" h-full @click="click()" />
            <span v-if="options" flex="~ items-center justify-center" absolute bottom--1 right--2 h-4 w-4 rounded-full bg-lime:30 text-8px>
              {{ options.length }}
            </span>
          </template>
          <div flex="~ col" w-100 of-auto py2>
            <NSwitch
              v-for="item, index of options"
              :key="item.name"
              v-model="options[index].defaultValue"
              flex="~ gap-2" rounded px2 py2
            >
              <span text-xs capitalize op75>
                {{ item.description }}
              </span>
            </NSwitch>
          </div>
        </NDropdown>
        <div flex-auto />
        <NButton icon="carbon-copy" mr-6 h-full @click="copyToClipboard()" />
      </div>
      <NCodeBlock v-if="generatedJson" :lang="shikiLanguage" :code="generatedJson" />
    </NDrawer>
  </Teleport>
</template>
