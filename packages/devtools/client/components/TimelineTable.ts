import type { PropType } from 'vue'
import type { FunctionMetricCallRecord } from '../../types'
import TimelineItem from './TimelineItem.vue'

// @unocss-include

export default defineComponent({
  name: 'TimelineTable',
  props: {
    records: {
      type: Array as PropType<FunctionMetricCallRecord[]>,
      required: true,
    },
  },
  setup(props) {
    const startTime = computed(() => props.records[0]?.start || Date.now())
    const scale = ref(35)
    const ruleInterval = ref(5000)

    const offsetX = 10
    const timeMax = ref(0)
    const graphItems = computed(() => {
      const layers: number[] = [0]
      let maxTime = 0

      const result = props.records.map((item) => {
        maxTime = Math.max(maxTime, item.end ?? item.start)
        let hIndex = layers.findIndex(layer => layer <= item.start)
        const width = item.name.length * 8 * scale.value
        const end = item.start + Math.max(width, (((item.end || Number.POSITIVE_INFINITY) - item.start) / scale.value))

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

      timeMax.value = maxTime
      return result
    })

    const now = useTimestamp({ interval: 500, immediate: true })

    return () => {
      const items = graphItems.value.map((item) => {
        return h(TimelineItem, {
          key: item.key,
          item: item.item,
          style: {
            position: 'absolute',
            top: `${3 + item.layer * 1.6}em`,
            left: `${offsetX + item.left / scale.value}px`,
            width: `${item.width / scale.value}px`,
          },
        })
      })

      const timeSpan = Math.max(timeMax.value - startTime.value, 20_0000)
      const minmapItems = graphItems.value.map((item) => {
        return h('div', {
          key: item.key,
          item: item.item,
          style: {
            position: 'absolute',
            background: getHashColorFromString(item.item.name, 50, 50),
            top: `${2 + item.layer * 3.5}px`,
            left: `${item.left / timeSpan * 100}%`,
            height: '3px',
            borderRadius: '2px',
            width: `${Math.max(item.width / timeSpan * 100, 0.2)}%`,
          },
        })
      })

      const lines = Array.from({ length: ((timeMax.value - startTime.value + 100000) / ruleInterval.value) }, (_, i) => {
        return [
          h('div', {
            class: 'absolute top-0 w-px h-full border-l border-base',
            style: {
              left: `${offsetX + i * ruleInterval.value / scale.value}px`,
            },
          }),
          h('div', {
            class: 'absolute p2 text-xs op50',
            style: {
              left: `${offsetX + i * ruleInterval.value / scale.value}px`,
            },
          }, `${i * ruleInterval.value / 1000}s`),
        ]
      }).flat()

      const nowLine = h('div', {
        class: 'absolute top-0 w-px h-full border-l border-green transition-all duration-500 ease-linear',
        style: {
          left: `${(now.value - startTime.value + 1000) / scale.value}px`,
        },
      })

      return h('div', {
        class: 'flex flex-col w-full h-screen',
      }, [
        h('div', {
          class: 'relative h-50px border border-base',
        }, minmapItems),
        h('div', {
          class: 'relative h-full w-full of-x-scroll',
        }, [
          nowLine,
          ...items,
          ...lines,
        ]),
      ])
    }
  },
})
