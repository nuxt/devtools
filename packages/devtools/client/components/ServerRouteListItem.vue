<script setup lang="ts">
import { NuxtLink } from '#components'
import type { ServerRouteInfo } from '~/../src/types'

withDefaults(defineProps<{
  item: ServerRouteInfo
  index: number
}>(), {
  index: 0,
})

const open = ref(false)
// const dropdown = ref(false)
</script>

<template>
  <div>
    <component
      :is="item.routes ? 'button' : NuxtLink"
      flex="~ gap-2" w-full items-center hover-bg-active px2 py1
      :class="[{ 'bg-active': $route.query.path === item.route }]"
      :style="{ paddingLeft: `calc(0.5rem + ${index * 1.5}em)` }"
      :to="{ query: { path: item.route } }"
      @click="open = !open"
    >
      <div :class="{ 'w-12': !item.routes }" flex-none text-left>
        <NIcon v-if="item.type === 'collection'" icon="carbon:chevron-right" mb0.5 :transform-rotate="open ? 90 : 0" transition />
        <Badge
          v-else
          :class="getRequestMethodClass(item.method || '*')"
          v-text="(item.method || '*').toUpperCase()"
        />
      </div>
      <span :class="{ 'flex items-center': item.routes }" flex-auto font-mono text-sm>
        <NIcon v-if="item.type === 'collection'" :title="`${item.routes?.length} routes`" icon="carbon:folder" mr1 />
        {{ item.route }}
      </span>
      <!-- TODO: maybe add options to create/delete/copy ... -->
      <!-- <NDropdown v-model="dropdown" position="right" n="sm">
        <template #trigger="{ click }">
          <NIconButton icon="carbon-overflow-menu-vertical" @click.stop.prevent="click()" />
        </template>
      </NDropdown> -->
      <Badge
        v-if="item.type === 'runtime'"
        flex-none
        class="bg-indigo-400:10 text-indigo-400"
        title="added at runtime"
      >
        runtime
      </Badge>
    </component>
    <div x-divider />
    <slot v-if="open">
      <ServerRouteListItem
        v-for="subItem in item.routes"
        :key="subItem.filepath"
        :item="subItem"
        :index="index + 1"
      />
    </slot>
  </div>
</template>
