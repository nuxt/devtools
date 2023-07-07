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

const MIN_WIDTH = 20_000

const startTime = computed(() => props.data.events[0]?.start || Date.now())
const endTime = computed(() => Math.max(...props.data.events.map(i => i.end || i.start)))
const fullTimeSpan = computed(() => Math.max(endTime.value - startTime.value, MIN_WIDTH) + 10_000)

const viewFinderWidth = ref(MIN_WIDTH)
const rect = reactive(useElementBounding(scroller))
const pixelPerMs = computed(() => rect.width / viewFinderWidth.value)

const segments = computed(() => segmentTimelineEvents(props.data.events))

useEventListener(scroller, 'scroll', () => {
  minimapScroller.value!.scrollLeft = scroller.value!.scrollLeft
})
useEventListener(minimapScroller, 'scroll', () => {
  scroller.value!.scrollLeft = minimapScroller.value!.scrollLeft
})
</script>

<template>
  <div h-screen w-full flex flex-col>
    <slot />
    <div relative>
      <div ref="minimap" relative h-50px border="t b base" border-base>
        <div
          v-for="segment, idx of segments"
          :key="idx"
          relative h-full flex-inline
          :style="{
            width: `${Math.max(100, segment.duration / 10)}px`,
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
          h-1px
          :style="{ width: `${fullTimeSpan * pixelPerMs}px` }"
        />
      </div>
    </div>
    <div ref="scroller" relative h-full w-full of-x-scroll ws-nowrap>
      <div
        absolute h-1px
        :style="{ width: `${fullTimeSpan * pixelPerMs}px` }"
      />

      <template v-for="segment, idx of segments" :key="idx">
        <div
          v-if="segment.previousDuration && segment.previousDuration > 200"
          border="x base"
          h-full flex-inline bg-gray:10 py2 text-xs write-vertical-left op50
        >
          <DurationDisplay
            :duration="segment.previousDuration"
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
