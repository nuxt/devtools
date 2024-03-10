<script setup lang="ts">
import type { NitroTask } from '../../src/types/tasks'

withDefaults(defineProps<{
  item: NitroTask
  index?: number
}>(), {
  index: 0,
})

const open = ref(true)
</script>

<template>
  <div>
    <button
      flex="~ gap-2" w-full items-start items-center hover-bg-active px2 py1
      :style="{ paddingLeft: `calc(0.5rem + ${index * 1.5}em)` }"
      @click="open = !open"
    >
      <div w12 flex-none text-left>
        <NBadge
          class="n-read"
          v-text="item.key"
        />
      </div>
      <span text-sm font-mono>
        {{ item.description }}
      </span>
      <!-- TODO: maybe add options to create/delete/copy ... -->
      <!-- <NDropdown v-model="dropdown" position="right" n="sm">
        <template #trigger="{ click }">
          <NButton icon="carbon-overflow-menu-vertical" :border="false" @click.stop.prevent="click()" />
        </template>
      </NDropdown> -->
    </button>
  </div>
</template>
