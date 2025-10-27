import type { TimelineEvent, TimelineEventFunction, TimelineEventNormalized, TimelineEventRoute, TimelineEventsSegment } from '../../types'

const MAX_SEGMENT_DURATION = 3_000
const SEGMENT_END_PADDING = 50

export function segmentTimelineEvents(events: TimelineEvent[]) {
  const segments: TimelineEventsSegment[] = []

  let current: TimelineEventsSegment = {
    start: 0,
    end: 0,
    events: [],
    functions: [],
    duration: 0,
  }

  for (const event of events) {
    const end = event.end || event.start
    // Segment events by max duration or route change
    if (
      (event.start - current.end > MAX_SEGMENT_DURATION)
      || event.type === 'route'
    ) {
      current = {
        start: event.start,
        end,
        events: [],
        functions: [],
        duration: 0,
      }
      segments.push(current)
    }

    current.events.push(event)
    current.end = end + SEGMENT_END_PADDING
  }

  segments.forEach((segment, idx) => {
    const duration = segment.end - segment.start

    const layers: number[] = []

    segment.duration = duration
    segment.previousGap = idx > 0 ? segment.start - segments[idx - 1]!.end : 0
    segment.events
      .forEach((event) => {
        const end = (event.end || event.start)
        let layer = 0

        if (event.type !== 'route') {
          layer = layers.findIndex(layer => layer <= event.start)
          if (layer === -1) {
            layer = layers.length
            layers.push(end + 1_000)
          }
          else {
            layers[layer] = end + 1_000
          }
        }

        const normalized: TimelineEventNormalized<TimelineEvent> = {
          event,
          segment,
          relativeStart: (event.start - segment.start) / duration,
          relativeWidth: (end - event.start) / duration,
          layer,
        }

        if (event.type === 'function')
          segment.functions.push(normalized as TimelineEventNormalized<TimelineEventFunction>)
        else
          segment.route = normalized as TimelineEventNormalized<TimelineEventRoute>
      })
  })

  return segments
}
