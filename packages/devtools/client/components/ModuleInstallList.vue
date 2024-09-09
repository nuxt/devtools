<script setup lang="ts">
import Fuse from 'fuse.js'
// @ts-expect-error missing types
import { RecycleScroller } from 'vue-virtual-scroller'
import type { ModuleStaticInfo } from '../../src/types'

type SortingFunction<T> = (a: T, b: T) => number

const emit = defineEmits(['close'])

const collection = useModulesList()

const sortingOptions = ['downloads', 'stars', 'updated', 'created'] as const
const ascendingOrder = ref(false)
const selectedSortingOption = ref<typeof sortingOptions[number]>(sortingOptions[0])

const sortingFactors: Record<typeof sortingOptions[number], SortingFunction<ModuleStaticInfo>> = {
  downloads: (a, b) => a.stats.downloads - b.stats.downloads,
  stars: (a, b) => a.stats.stars - b.stats.stars,
  created: (a, b) => a.stats.createdAt - b.stats.createdAt,
  updated: (a, b) => a.stats.publishedAt - b.stats.publishedAt,
}

const sortedItems = computed(() => collection.value
  ?.toSorted((a, b) => sortingFactors[selectedSortingOption.value](a, b) * (ascendingOrder.value ? 1 : -1)))

const search = ref('')
const fuse = computed(() => new Fuse(collection.value || [], {
  keys: [
    'name',
    'description',
    'npm',
    'category',
  ],
  sortFn: (a, b) => {
    const itemA = collection.value?.[a.idx]
    const itemB = collection.value?.[b.idx]
    if (itemA && itemB)
      return sortingFactors[selectedSortingOption.value](itemA, itemB) * (ascendingOrder.value ? 1 : -1)
    return (a.score - b.score)
  },
  threshold: 0.2,
}))

const items = computed(() => {
  if (!search.value)
    return sortedItems.value
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
    <NNavbar v-model:search="search" no-padding px-6 pb-5 pt-2>
      <template #actions>
        <NDropdown direction="end" n="sm primary">
          <template #trigger="{ click }">
            <div flex="~  items-center">
              <NButton
                :icon="ascendingOrder ? 'tabler:sort-ascending' : 'tabler:sort-descending'"
                h-full rounded-r-none
                @click="ascendingOrder = !ascendingOrder"
              />
              <NButton
                flex="~ justify-between"
                min-w-30 border-l-0 rounded-l-none px-2 capitalize
                hover="border-l-1"
                @click="click()"
              >
                {{ selectedSortingOption }}
                <NIcon icon="carbon:chevron-down" />
              </NButton>
            </div>
          </template>
          <div flex="~ col" w-30 of-auto>
            <NButton
              v-for="item of sortingOptions"
              :key="item"
              :border="false" p2
              hover="n-checkbox-hover text-green"
              @click="selectedSortingOption = item"
            >
              <span flex="~ justify-between" w-full text-xs capitalize op75>
                {{ item }}
                <NIcon v-if="selectedSortingOption === item" icon="carbon:checkmark" />
              </span>
            </NButton>
          </div>
        </NDropdown>
      </template>
    </NNavbar>

    <div flex-auto of-auto flex="~ col gap-2" pl6 pr4>
      <RecycleScroller
        v-slot="{ item }"
        class="scroller"
        :items="items"
        :item-size="200"
        key-field="name"
      >
        <ModuleItemInstall :item="item" @start="emit('close')" />
      </RecycleScroller>
    </div>
  </div>
</template>
