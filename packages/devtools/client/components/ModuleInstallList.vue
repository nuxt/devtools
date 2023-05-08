<script setup lang="ts">
// @ts-expect-error missing types
import { RecycleScroller } from 'vue-virtual-scroller'
import Fuse from 'fuse.js'

const collection = await useModulesInfo()
const nuxt3only = collection.filter(i => i.compatibility.nuxt.includes('^3'))

const search = ref('')
const fuse = computed(() => new Fuse(nuxt3only, {
  keys: [
    'name',
    'description',
    'npm',
    'category',
  ],
}))

const items = computed(() => {
  if (!search.value)
    return nuxt3only
  return fuse.value.search(search.value).map(r => r.item)
})
</script>

<template>
  <div h-full flex="~ col gap-4">
    <NIconTitle
      mx6 mt6
      text-xl op75
      icon="i-carbon-3d-mpr-toggle"
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
        <ModuleItemBase
          :mod="{}"
          :info="item" mb2 h-full
          :compact="true"
        />
      </RecycleScroller>
    </div>
  </div>
</template>
