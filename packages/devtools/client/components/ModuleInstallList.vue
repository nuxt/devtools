<script setup lang="ts">
// @ts-expect-error missing types
import { RecycleScroller } from 'vue-virtual-scroller'
import Fuse from 'fuse.js'

const emit = defineEmits(['close'])

const collection = useModulesList()

const search = ref('')
const fuse = computed(() => new Fuse(collection.value || [], {
  keys: [
    'name',
    'description',
    'npm',
    'category',
  ],
}))

const items = computed(() => {
  if (!search.value)
    return collection.value
  return fuse.value.search(search.value).map(r => r.item)
})
</script>

<template>
  <div h-full flex="~ col gap-4">
    <NIconTitle
      mx6 mt6
      text-xl op75
      icon="i-carbon-intent-request-create"
      text="Install Module"
    />

    <NTextInput
      v-model="search"
      placeholder="Search..."
      icon="carbon-search" n="primary"
      mx6 px-5 py-2
    />

    <div flex-auto of-auto flex="~ col gap-2" pl6 pr4>
      <RecycleScroller
        v-slot="{ item }"
        class="scroller"
        :items="items"
        :item-size="160"
        key-field="name"
      >
        <ModuleItemInstall :item="item" @start="emit('close')" />
      </RecycleScroller>
    </div>
  </div>
</template>
