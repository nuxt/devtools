<script setup lang="ts">
import { InputData, jsonInputForTargetLanguage, quicktype } from 'quicktype-core'
import { all as languages } from 'quicktype-core/dist/language/All'
import type { Lang } from 'shiki-es'

const props = defineProps<{
  name?: string
  input: string
}>()

const drawer = ref(false)
const counter = ref(0)

const selectedLang = ref('TypeScript')
const language = computed(() => languages.find(l => l.displayName === selectedLang.value))
// TODO: use localStorage
const options = ref(language.value?.optionDefinitions.filter(o => typeof o.defaultValue === 'boolean'))

const generatedJson = computedAsync(async () => {
  // eslint-disable-next-line no-unused-expressions
  counter.value

  const jsonInput = jsonInputForTargetLanguage(selectedLang.value)

  await jsonInput.addSource({
    name: props.name ?? 'Input',
    samples: [props.input],
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

const shikiLanguage = computed<Lang>(() => {
  const lang = selectedLang.value.toLocaleLowerCase()
  if (lang.startsWith('javascript'))
    return 'javascript'
  else if (lang.startsWith('json'))
    return 'json'
  else if (lang.startsWith('typescript'))
    return 'typescript'
  else
    return lang as Lang
})

watch(options, () => {
  counter.value++
}, { deep: true })

watch(selectedLang, () => {
  options.value = language.value?.optionDefinitions.filter(o => typeof o.defaultValue === 'boolean')
})

function toggleDrawer() {
  drawer.value = !drawer.value
}

const copy = useCopy()

function copyToClipboard() {
  copy(generatedJson.value)
}
</script>

<template>
  <div>
    <slot name="button" :click="toggleDrawer">
      <NIconButton
        v-tooltip="'Generate Data Schema'"
        title="Generate Data Schema"
        icon="carbon:container-services" @click="toggleDrawer()"
      />
    </slot>
    <Teleport v-if="language" to="body">
      <DrawerRight v-model="drawer" auto-close md-w-2xl n-code-block @close="drawer = false">
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
              <NIconButton icon="carbon-settings" p3.1 border="~ base" @click="click()" />
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
          <NIconButton icon="carbon-copy" border="~ base" mr-6 p3.1 @click="copyToClipboard()" />
        </div>
        <NCodeBlock v-if="generatedJson" :lang="shikiLanguage" :code="generatedJson" />
      </DrawerRight>
    </Teleport>
  </div>
</template>
