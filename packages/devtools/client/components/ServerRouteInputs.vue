<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: any
  keys?: string[]
  default?: any
  disabled?: boolean
}>(), {
  keys: () => [],
  disabled: false,
  default: () => ({}),
})

const emit = defineEmits<{ (...args: any): void }>()
const params = useVModel(props, 'modelValue', emit, { passive: true })

const filteredKeys = computed(() => {
  return [...props.keys, 'active', 'key', 'value', 'type']
})

const keysObject = computed(() => {
  const obj: any = {}
  for (const key of filteredKeys.value)
    obj[key] = props.default[key] || ''
  return obj
})

const inputTypes = ['string', 'number', 'boolean', 'file', 'date', 'time', 'datetime-local']

function onFileInputChange(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      params.value[index].value = reader.result
    }
  }
}

watch(() => params, (items) => {
  items.value.forEach((item: any) => {
    if (item.type === 'number' && typeof item.value !== 'number') {
      const parsed = Number.parseFloat(item.value)
      item.value = Number.isNaN(parsed) ? 0 : parsed
    }
    else if (item.type === 'boolean' && typeof item.value !== 'boolean') {
      item.value = true
    }
    else if (item.type === 'file' && typeof item.value !== 'object') {
      item.value = ''
    }
    else if (item.type === 'date' && typeof item.value === 'string' && !item.value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      item.value = new Date().toISOString().slice(0, 10)
    }
    else if (item.type === 'time' && typeof item.value === 'string' && !item.value.match(/^\d{2}:\d{2}$/)) {
      item.value = new Date().toISOString().slice(11, 16)
    }
    else if (item.type === 'datetime-local' && typeof item.value === 'string' && !item.value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
      item.value = new Date().toISOString().slice(0, 16)
    }
    else if (item.type === 'string') {
      item.value = item.value.toString()
    }
  })
}, { deep: true, immediate: true, flush: 'sync' })
</script>

<template>
  <div p4 flex="~ col gap-4">
    <div v-for="(item, index) in params" :key="index" flex="~ gap-2" justify-around>
      <slot name="input" :item="item" />

      <template v-for="key of filteredKeys" :key="key">
        <NCheckbox
          v-if="item.type !== null && key === 'active'"
          v-model="item[key]"
          n="sm primary"
          :disabled="disabled"
        />
        <NTextInput
          v-if="item.type !== null && key === 'key'"
          v-model="item[key]"
          :placeholder="key" flex-1 font-mono n="sm primary"
          :disabled="disabled"
          :class="disabled ? 'op50' : ''"
        />
        <template v-else-if="key === 'value'">
          <NTextInput
            v-if="item.type === 'file'" type="file"
            :disabled="disabled"
            :class="disabled ? 'op75' : ''"
            @change="onFileInputChange(index, $event)"
          />
          <div v-else-if="item.type === 'boolean'" ml2 flex>
            <NCheckbox v-model="item.value" placeholder="Value" n="green lg" :disabled="disabled" />
          </div>
          <NTextInput
            v-else
            v-model="item.value"
            :type="item.type" placeholder="Value"
            flex-1 font-mono n="sm primary"
            :disabled="disabled"
            :class="disabled ? 'op75' : ''"
          />
        </template>
        <NSelect
          v-else-if="key === 'type'"
          v-model="item.type" n="sm green"
          :class="disabled ? 'op75' : ''"
          :disabled="disabled"
        >
          <option v-for="typeItem of inputTypes" :key="typeItem" :value="typeItem">
            {{ typeItem }}
          </option>
        </NSelect>
      </template>

      <slot name="input-actions">
        <NButton n="red" :disabled="disabled" :class="disabled ? 'op0!' : ''" @click="params.splice(index, 1)">
          <NIcon icon="carbon:trash-can" />
        </NButton>
      </slot>
    </div>
    <div v-if="!disabled" flex gap-4>
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
          my1 px-3 @click="params.splice(0, params.length)"
        >
          Remove All
        </NButton>
      </slot>
    </div>
    <slot />
  </div>
</template>
