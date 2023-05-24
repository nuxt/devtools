<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: any[]
  exclude?: string[]
  defaults?: any
  type?: string[]
  keys?: string[]
}>(), {
  exclude: () => [],
  defaults: () => [],
  type: () => ['value'],
  keys: () => [],
})

const emit = defineEmits<{ (...args: any): void }>()
const params = useVModel(props, 'modelValue', emit, { passive: true }) as any

const filteredKeys = computed(() => {
  const excludes = [...props.exclude, 'type']
  return props.keys.filter(i => !excludes.includes(i))
})

const keysObject = computed(() => {
  const obj: any = {}
  for (const key of props.keys)
    obj[key] = props.defaults[key] || ''
  return obj
})

// TODO: add better support for file, color, etc
const inputTypes = ['text', 'number', 'boolean', 'file', 'date', 'time', 'datetime-local']
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
  <div v-for="(item, index) in params" :key="index" flex="~ gap-2" justify-around>
    <slot name="input" :item="item" />
    <template v-for="key of filteredKeys" :key="key">
      <NTextInput v-if="item.type && !type.includes(key)" v-model="item[key]" :placeholder="key" flex-1 font-mono n="sm" />
      <template v-else>
        <NTextInput v-if="item.type === 'file'" type="file" @change="onFileInputChange(index, $event)" />
        <div v-else-if="item.type === 'boolean'" ml2 flex>
          <NCheckbox v-model="item.value" placeholder="Value" n="green lg" />
        </div>
        <NTextInput v-else v-model="item.value" :type="item.type" placeholder="Value" flex-1 font-mono n="sm" />
      </template>
    </template>
    <NSelect v-model="item.type" n="sm">
      <option v-for="inType of inputTypes" :key="inType" :value="inType">
        {{ inType }}
      </option>
    </NSelect>
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
      <NButton
        v-if="params.length"
        icon="carbon-trash-can" n="sm red"
        my1 px-3 @click="params = []"
      >
        Remove All
      </NButton>
    </slot>
  </div>
</template>
