<script setup lang="ts">
import type { TimelineFunctionRecord, TimlineMetrics } from '../../types'

const props = defineProps<{
  data: TimlineMetrics
}>()

const emit = defineEmits<{
  (event: 'select', record: TimelineFunctionRecord): void
}>()

const scroller = ref<HTMLElement>()
const minimap = ref<HTMLElement>()
const minimapScroller = ref<HTMLElement>()

const MIN_WIDTH = 20_000

const startTime = computed(() => props.data.functions[0]?.start || Date.now())
const endTime = computed(() => Math.max(...props.data.functions.map(i => i.end || i.start)))
const fullTimeSpan = computed(() => Math.max(endTime.value - startTime.value, MIN_WIDTH) + 10_000)

const ruleInterval = 5_000
const viewFinderWidth = ref(MIN_WIDTH)
const rect = reactive(useElementBounding(scroller))
const now = useTimestamp({ interval: 500, immediate: true })
const pixelPerMs = computed(() => rect.width / viewFinderWidth.value)

const offsetX = 10
const graphItems = computed(() => {
  const layers: number[] = [0]

  const result = props.data.functions.map((item) => {
    let hIndex = layers.findIndex(layer => layer <= item.start)
    const width = (item.end || item.start) - item.start + 1_000
    const end = item.start + width

    if (hIndex === -1) {
      hIndex = layers.length
      layers.push(end)
    }
    else {
      layers[hIndex] = end
    }

    return {
      key: item.name + item.start,
      layer: hIndex,
      item,
      width: item.end ? (item.end - item.start) : 20000,
      left: (item.start - startTime.value),
    }
  })
  return result
})

useEventListener(scroller, 'scroll', () => {
  minimapScroller.value!.scrollLeft = scroller.value!.scrollLeft
})
useEventListener(minimapScroller, 'scroll', () => {
  scroller.value!.scrollLeft = minimapScroller.value!.scrollLeft
})
</script>

<template>
  <div h-screen w-full flex flex-col>
    <div relative>
      <div ref="minimap" relative h-50px border border-base>
        <div
          v-for="item of graphItems"
          :key="item.key"
          :item="item.item"
          :style="{
            position: 'absolute',
            background: getHashColorFromString(item.item.name, 50, 50),
            top: `${2 + item.layer * 3.5}px`,
            left: `${item.left / fullTimeSpan * 100}%`,
            height: '3px',
            borderRadius: '2px',
            width: `${Math.max(item.width / fullTimeSpan * 100, 0.2)}%`,
          }"
        />
      </div>
      <div ref="minimapScroller" class="timeline-scroller" absolute inset-0 h-full w-full of-x-scroll>
        <div
          h-1px
          :style="{ width: `${fullTimeSpan * pixelPerMs}px` }"
        />
      </div>
    </div>
    <div ref="scroller" relative h-full w-full of-x-scroll>
      <div
        absolute h-1px
        :style="{ width: `${fullTimeSpan * pixelPerMs}px` }"
      />
      <div
        absolute top-0 z-100 h-full w-px border-l border-blue transition-all duration-500 ease-linear
        :style="{ left: `${(now - startTime + 1000) * pixelPerMs}px` }"
      />
      <TimelineItem
        v-for="i of graphItems"
        :key="i.key"
        :item="i.item"
        :width="i.width * pixelPerMs"
        :style="{
          position: 'absolute',
          top: `${4 + i.layer * 1.6}em`,
          left: `${offsetX + i.left * pixelPerMs}px`,
        }"
        @click="emit('select', i.item)"
      />
      <template v-for="i in Math.floor(fullTimeSpan / ruleInterval)" :key="i">
        <div
          absolute top-0 h-full w-px border-l border-base
          :style="{
            left: `${offsetX + i * ruleInterval * pixelPerMs}px`,
          }"
        />
        <div
          absolute p2 text-xs op30
          :style="{
            left: `${offsetX + i * ruleInterval * pixelPerMs}px`,
          }"
        >
          {{ i * ruleInterval / 1000 }}s
        </div>
      </template>
      <template v-for="i in data.routes" :key="i">
        <div
          absolute top-0 h-full w-px border-l border-green6 border-dashed op50
          :style="{
            left: `${offsetX + (i.start - startTime) * pixelPerMs}px`,
          }"
        />
        <div
          absolute mt8 text-xs font-mono text-green6 bg-base border="l green6"
          :style="{
            left: `${offsetX + (i.start - startTime) * pixelPerMs}px`,
          }"
        >
          <div bg-green6:10 px1 py0.5>
            {{ i.to }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.timeline-scroller::-webkit-scrollbar {
  height: 100px;
}

.timeline-scroller::-webkit-scrollbar-track {
  background-color: transparent;
}

.timeline-scroller::-webkit-scrollbar-thumb {
  background-color: #8881;
  height: 100px;
}
.timeline-scroller:hover::-webkit-scrollbar-thumb {
  background-color: #8882;
}
</style>
