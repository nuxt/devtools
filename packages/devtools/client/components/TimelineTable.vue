<script setup lang="ts">
import type { TimelineEventFunction, TimlineMetrics } from '../../types'
import { segmentTimelineEvents } from '~/composables/timeline'

const props = defineProps<{
  data: TimlineMetrics
}>()

const emit = defineEmits<{
  (event: 'select', record: TimelineEventFunction): void
}>()

const scroller = ref<HTMLElement>()
const minimap = ref<HTMLElement>()
const minimapScroller = ref<HTMLElement>()
const minimapScrollerInner = ref<HTMLElement>()

const segments = computed(() => segmentTimelineEvents(props.data.events))

const scrollWidth = computed(() => {
  // eslint-disable-next-line no-unused-expressions
  props.data.events.length
  return scroller.value?.scrollWidth || window.innerWidth
})

function syncSize() {
  if (minimapScrollerInner.value)
    minimapScrollerInner.value.style.width = `${scrollWidth.value}px`
}

watch(
  () => props.data.events.length,
  async () => {
    await nextTick()
    syncSize()
  },
  { flush: 'post' },
)

useEventListener(scroller, 'scroll', () => {
  syncSize()
  minimapScroller.value!.scrollLeft = scroller.value!.scrollLeft
})
useEventListener(minimapScroller, 'scroll', () => {
  syncSize()
  scroller.value!.scrollLeft = minimapScroller.value!.scrollLeft
})
</script>

<template>
  <div h-screen w-full flex flex-col>
    <slot />
    <div relative>
      <div ref="minimap" border="t b base" relative h-50px ws-nowrap border-base>
        <div
          v-for="segment, idx of segments"
          :key="idx"
          relative h-full flex-inline
          :style="{
            width: `${Math.max(100, segment.duration / 10) / (scrollWidth) * 100}%`,
          }"
        >
          <div
            v-for="item, iidx of segment.functions"
            :key="iidx"
            h-3px rounded
            :style="{
              width: `max(${item.relativeWidth * 100}%, 10px)`,
              position: 'absolute',
              top: `${item.layer * 4}px`,
              left: `${item.relativeStart * 100}%`,
              backgroundColor: getHashColorFromString(item.event.name, 50, 60),
            }"
          />
          <template v-for="i in segment.routes" :key="i">
            <div
              absolute top-0 h-full w-px border-l border-green6 op10
              :style="{
                left: `${i.relativeStart * 100}%`,
              }"
            />
          </template>
        </div>
      </div>
      <div ref="minimapScroller" class="timeline-scroller" absolute inset-0 h-full w-full of-x-scroll>
        <div
          ref="minimapScrollerInner"
          h-1px
        />
      </div>
    </div>
    <div ref="scroller" relative h-full w-full of-x-scroll ws-nowrap>
      <template v-for="segment, idx of segments" :key="idx">
        <div
          v-if="segment.previousGap && segment.previousGap >= 200"
          border="x base"
          h-full flex-inline bg-gray:10 py4 text-xs write-vertical-left op50
        >
          <DurationDisplay
            op50
            :duration="segment.previousGap"
            :color="false"
          />
        </div>
        <TimelineSegment
          flex-inline of-x-hidden hover:of-x-visible
          :segment="segment"
          :style="{
            width: `${Math.max(100, segment.duration / 10)}px`,
          }"
          @select="emit('select', $event)"
        />
      </template>

      <!-- <template v-for="i in Math.floor(fullTimeSpan / ruleInterval)" :key="i">
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
      </template> -->
    </div>
  </div>
</template>

<style scoped>
.timeline-scroller::-webkit-scrollbar {
  height: 100px;
  width: 0.1px;;
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
