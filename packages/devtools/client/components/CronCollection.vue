<script setup lang="ts">
import cronstrue from 'cronstrue'
import type { CronCollection } from '../../src/types/tasks'

const props = defineProps<{
  collection: CronCollection
}>()

const currentTaskRoute = useCurrentServerTask()
const open = ref(true)

const humanReadableCron = computed(() => {
  return cronstrue.toString(props.collection.cron)
})
</script>

<template>
  <div>
    <button
      flex="~ gap-2" w-full items-start items-center hover-bg-active p2
      :title="humanReadableCron"
      @click="open = !open"
    >
      <div flex-none text-left>
        <NIcon icon="carbon:chevron-right" mb0.5 :transform-rotate="open ? 90 : 0" transition />
      </div>
      <span flex="~ gap-2" min-w-0 items-center text-sm font-mono>
        ({{ collection.tasks.length }})
        <NBadge
          class="n-orange"
          v-text="collection.cron"
        />
        <span class="truncate">{{ humanReadableCron }}</span>
      </span>
    </button>
    <div x-divider />
    <ul v-if="open">
      <li v-for="task in collection.tasks" :key="task">
        <button
          flex="~ gap-2" w-full items-start items-center hover-bg-active p2 pl-14
          :class="[{ 'bg-active': currentTaskRoute === task }]"
          @click="currentTaskRoute = task"
        >
          <NBadge
            class="n-blue"
            v-text="task"
          />
        </button>
        <div x-divider />
      </li>
    </ul>
  </div>
</template>
