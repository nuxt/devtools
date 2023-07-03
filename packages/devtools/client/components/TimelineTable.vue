<script setup lang="ts">
import type { FunctionMetricCallRecord } from '../../types'

const props = defineProps<{
  records: FunctionMetricCallRecord[]
}>()

const scroller = ref<HTMLElement>()

const startTime = computed(() => props.records[0]?.start || Date.now())
const endTime = computed(() => Math.max(...props.records.map(i => i.end || i.start)))
const fullTimeSpan = computed(() => Math.max(endTime.value - startTime.value, 30_000))

const ruleInterval = 5_000
const viewFinderWidth = ref(30_000)
const rect = reactive(useElementBounding(scroller))
const scroll = reactive(useScroll(scroller))
const now = useTimestamp({ interval: 500, immediate: true })
const pixelPerMs = computed(() => rect.width / viewFinderWidth.value)

const offsetX = 10
const graphItems = computed(() => {
  const layers: number[] = [0]

  const result = props.records.map((item) => {
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
</script>

<template>
  <div h-screen w-full flex flex-col>
    <div relative h-50px border border-base>
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
      <div
        absolute h-full bg-gray:10
        :style="{
          left: `${scroll.x / (scroller?.scrollWidth || 1000) * 100}%`,
          width: `${viewFinderWidth / fullTimeSpan * 100}%`,
        }"
      />
    </div>
    <div ref="scroller" relative h-full w-full of-x-scroll>
      <div
        absolute top-0 h-full w-px border-l border-green transition-all duration-500 ease-linear
        :style="{ left: `${(now - startTime + 1000) * pixelPerMs}px` }"
      />
      <TimelineItem
        v-for="i of graphItems"
        :key="i.key"
        :item="i.item"
        :style="{
          position: 'absolute',
          top: `${3 + i.layer * 1.6}em`,
          left: `${offsetX + i.left * pixelPerMs}px`,
          width: `${i.width * pixelPerMs}px`,
        }"
      />
      <template v-for="i in Math.floor(fullTimeSpan / ruleInterval)" :key="i">
        <div
          absolute top-0 h-full w-px border-l border-base
          :style="{
            left: `${offsetX + i * ruleInterval * pixelPerMs}px`,
          }"
        />
        <div
          absolute p2 text-xs op50
          :style="{
            left: `${offsetX + i * ruleInterval * pixelPerMs}px`,
          }"
        >
          {{ i * ruleInterval / 1000 }}s
        </div>
      </template>
    </div>
  </div>
</template>
