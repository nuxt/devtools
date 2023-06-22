<script setup lang="ts">
import type { ServerRouteInfo } from '~/../src/types'

withDefaults(defineProps<{
  item: ServerRouteInfo
  selected: any
  divider?: boolean
}>(), {
  divider: true,
})
</script>

<template>
  <div>
    <NuxtLink
      flex="~ gap-2" items-center hover-bg-active px2 py1
      :class="[{ 'bg-active': selected?.route === item.route }]"
      :to="{ query: { path: item.route } }"
    >
      <div w-12 flex-none text-left>
        <Badge
          :class="getRequestMethodClass(item.method || '*')"
          v-text="(item.method || '*').toUpperCase()"
        />
      </div>
      <span flex-auto font-mono text-sm>{{ item.route }}</span>
      <Badge
        v-if="item.type === 'runtime'"
        flex-none
        class="bg-indigo-400:10 text-indigo-400"
        title="added at runtime"
      >
        runtime
      </Badge>
    </NuxtLink>
    <div v-if="divider" x-divider />
  </div>
</template>
