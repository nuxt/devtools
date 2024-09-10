<script setup lang="ts">
import { clamp } from '@antfu/utils'
import { segmentTimelineEvents } from '~/composables/timeline'
import type { TimelineEvent, TimelineEventNormalized, TimelineMetrics } from '../../types'

const props = defineProps<{
  data: TimelineMetrics
}>()

const emit = defineEmits<{
  (event: 'select', record: TimelineEventNormalized<TimelineEvent>): void
}>()

const scroller = ref<HTMLElement>()
const minimap = ref<HTMLElement>()
const minimapScroller = ref<HTMLElement>()
const minimapScrollerInner = ref<HTMLElement>()
const followScroll = ref(true)
const scale = ref(1.5)

const segments = computed(() => segmentTimelineEvents(props.data.events))

const scrollWidth = computed(() => {
  // eslint-disable-next-line ts/no-unused-expressions
  props.data.events.length
  return scroller.value?.scrollWidth || window.innerWidth
})

function syncSize() {
  if (minimapScrollerInner.value)
    minimapScrollerInner.value.style.width = `${scrollWidth.value}px`
}

function scrollToEnd() {
  if (followScroll.value && scroller.value) {
    // scroller.value.scrollLeft = scroller.value.scrollWidth
    // minimapScroller.value!.scrollLeft = scroller.value.scrollWidth

    scroller.value.scrollTo({
      left: scroller.value.scrollWidth - scroller.value.clientWidth,
      behavior: 'smooth',
    })
    minimapScroller.value!.scrollTo({
      left: scroller.value.scrollWidth - scroller.value.clientWidth,
      behavior: 'smooth',
    })
  }
}

watch(
  () => props.data.events.length,
  async () => {
    await nextTick()
    syncSize()
    scrollToEnd()
  },
  { flush: 'post' },
)

useEventListener(scroller, 'scroll', () => {
  if (minimapScroller.value!.scrollLeft !== scroller.value!.scrollLeft) {
    syncSize()
    minimapScroller.value!.scrollLeft = scroller.value!.scrollLeft
    followScroll.value = scroller.value!.scrollLeft >= scroller.value!.scrollWidth - scroller.value!.clientWidth
  }
})
useEventListener(minimapScroller, 'scroll', () => {
  if (minimapScroller.value!.scrollLeft !== scroller.value!.scrollLeft) {
    syncSize()
    scroller.value!.scrollLeft = minimapScroller.value!.scrollLeft
  }
})
useEventListener(scroller, 'wheel', (e: WheelEvent) => {
  if (e.altKey) {
    scale.value = clamp(scale.value + e.deltaY / 200, 0.5, 3)
    syncSize()
  }
  else {
    scroller.value!.scrollLeft += e.deltaY
  }
})
</script>

<template>
  <div relative>
    <div ref="minimap" border="t b base" relative h-50px ws-nowrap border-base>
      <div
        v-for="segment, idx of segments"
        :key="idx"
        relative h-full flex-inline
        :style="{
          width: `${Math.max(100, segment.duration / 10) / scrollWidth * 100}%`,
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
        <template v-if="segment.route">
          <div
            absolute top-0 h-full w-px border-l border-green6 op10
            :style="{
              left: `${segment.route.relativeStart * 100}%`,
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
  <div ref="scroller" relative h-full w-full of-x-scroll of-y-hidden ws-nowrap n-panel-grids>
    <template v-for="segment, idx of segments" :key="idx">
      <div
        v-if="segment.previousGap && segment.previousGap >= 200"
        border="x base"
        h-full flex-inline bg-true-gray-1 py15 text-xs write-vertical-left op50 dark:bg-true-gray-9
      >
        <DurationDisplay
          op50
          :duration="segment.previousGap"
          :color="false"
        />
      </div>
      <TimelineSegment
        flex-inline of-x-hidden hover:of-x-visible bg-base
        :class="idx === segments.length - 1 ? 'border-r border-base' : ''"
        :segment="segment"
        :style="{
          width: `${Math.max(50, segment.duration / 10) * scale}px`,
        }"
        @select="emit('select', $event)"
      />
    </template>
  </div>
</template>

<style scoped>
.timeline-scroller::-webkit-scrollbar {
  height: 100px;
  width: 0.1px;
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
