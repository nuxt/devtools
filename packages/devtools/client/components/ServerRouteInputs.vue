<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: any
  keys?: string[]
  default?: any
  exclude?: string[]
}>(), {
  keys: () => [],
  default: () => ({}),
  exclude: () => [],
})

const emit = defineEmits<{ (...args: any): void }>()
const params = useVModel(props, 'modelValue', emit, { passive: true }) as any

const filteredKeys = computed(() => {
  const keys = [...props.keys, 'key', 'value', 'type']
  return [...keys.filter(i => !props.exclude.includes(i))]
})

const keysObject = computed(() => {
  const obj: any = {}
  for (const key of filteredKeys.value)
    obj[key] = props.default[key] || ''
  return obj
})

// TODO: add better support for file, color, etc
const inputTypes = ['string', 'number', 'boolean', 'file', 'date', 'time', 'datetime-local']

function onFileInputChange(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      params[index].value = reader.result
    }
  }
}
</script>

<template>
  <div p4 flex="~ col gap-4">
    <div v-for="(item, index) in params" :key="index" flex="~ gap-2" justify-around>
      <slot name="input" :item="item" />

      <template v-for="key of filteredKeys" :key="key">
        <NTextInput v-if="item?.type !== null && key === 'key'" v-model="item[key]" :placeholder="key" flex-1 font-mono n="sm" />
        <template v-else-if="key !== 'type'">
          <NTextInput v-if="item.type === 'file'" type="file" @change="onFileInputChange(index, $event)" />
          <div v-else-if="item.type === 'boolean'" ml2 flex>
            <NCheckbox v-model="item.value" placeholder="Value" n="green lg" />
          </div>
          <NTextInput v-else v-model="item.value" :type="item.type" placeholder="Value" flex-1 font-mono n="sm" />
        </template>
        <NSelect v-else-if="key === 'type'" v-model="item.type" n="sm green">
          <option v-for="typeItem of inputTypes" :key="typeItem" :value="typeItem">
            {{ typeItem }}
          </option>
        </NSelect>
      </template>

      <slot name="input-actions">
        <NButton n="red" @click="params.splice(index, 1)">
          <NIcon icon="carbon:delete" />
        </NButton>
      </slot>
    </div>
    <div flex gap-4>
      <slot name="actions" :params="params">
        <NButton
          icon="carbon-add" n="sm primary"
          my1 px-3 @click="params.push({ ...keysObject })"
        >
          Add
        </NButton>
        <div flex-auto />
        <NButton
          v-if="params.length"
          icon="carbon-trash-can" n="sm red"
          my1 px-3 @click="params = []"
        >
          Remove All
        </NButton>
      </slot>
    </div>
  </div>
</template>
