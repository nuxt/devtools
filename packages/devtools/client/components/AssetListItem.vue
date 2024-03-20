<script setup lang="ts">
import type { AssetInfo } from '~/../src/types'

const props = withDefaults(defineProps<{
  item: any
  index?: number
  modelValue: AssetInfo | undefined
}>(), {
  index: 0,
})

const emit = defineEmits<{ (...args: any): void }>()
const model = useVModel(props, 'modelValue', emit, { passive: true })

const isCollection = computed(() => props.item?.children?.length)

const open = ref(true)

const icon = computed(() => {
  if (isCollection.value)
    return 'i-carbon-folder'
  if (props.item.type === 'image')
    return 'i-carbon-image'
  if (props.item.type === 'video')
    return 'i-carbon-video'
  if (props.item.type === 'audio')
    return 'i-carbon-volume-up'
  if (props.item.type === 'font')
    return 'i-carbon-text-small-caps'
  if (props.item.type === 'text')
    return 'i-carbon-document'
  if (props.item.type === 'json')
    return 'i-carbon-json'
  return 'i-carbon-document-blank'
})
</script>

<template>
  <div>
    <button
      flex="~ gap-2" w-full items-center hover="bg-active" px4 py1
      :style="{ paddingLeft: `calc(1rem + ${index * 1.5}em)` }"
      :class="{ 'bg-active': !isCollection && model?.filePath === item?.filePath }"
      border="b base"
      @click="isCollection ? open = !open : model = item"
    >
      <div :class="icon" />
      <span :class="{ 'flex items-center': isCollection }" flex-auto text-start text-sm font-mono>
        {{ item.path }}
        <NIcon v-if="item.layer" icon="i-carbon-layers" bg-primary />
      </span>
      <NIcon v-if="isCollection" icon="carbon:chevron-right" :transform-rotate="open ? 90 : 0" transition />
    </button>
    <slot v-if="open">
      <AssetListItem
        v-for="subItem in item?.children"
        :key="subItem.filepath"
        v-model="model"
        :item="subItem"
        :index="index + 1"
      />
    </slot>
  </div>
</template>
