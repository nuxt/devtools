<script setup lang="ts">
import type { ServerTaskInfo } from '~/../../src/types'

withDefaults(defineProps<{
  item: ServerTaskInfo
  index?: number
}>(), {
  index: 0,
})

const open = ref(true)
const currentTaskRoute = useCurrentServerTask()
</script>

<template>
  <div>
    <button
      flex="~ gap-2" w-full items-start items-center hover-bg-active px2 py1
      :class="[{ 'bg-active': currentTaskRoute === item.name }]"
      :style="{ paddingLeft: `calc(0.5rem + ${index * 1.5}em)` }"
      @click="open = !open;currentTaskRoute = item.name"
    >
      <div flex-none text-left>
        <NIcon v-if="item.type === 'collection'" icon="carbon:chevron-right" mb0.5 :transform-rotate="open ? 90 : 0" transition />
      </div>
      <span flex items-center text-sm font-mono>
        <template v-if="item.type === 'collection'">
          <NIcon :title="`${item.tasks?.length} tasks`" icon="carbon:folder" mr1 />
        </template>
        <template v-else>
          <NIcon icon="carbon:play" ml3 mr1 />
        </template>
        {{ item.name }}
      </span>
      <!-- TODO: maybe add options to create/delete/copy ... -->
      <!-- <NDropdown v-model="dropdown" position="right" n="sm">
        <template #trigger="{ click }">
          <NButton icon="carbon-overflow-menu-vertical" :border="false" @click.stop.prevent="click()" />
        </template>
      </NDropdown> -->
    </button>
    <div x-divider />
    <slot v-if="open">
      <ServerTaskListItem
        v-for="subItem in item.tasks"
        :key="subItem.name"
        :item="subItem"
        :index="index + 1"
      />
    </slot>
  </div>
</template>
