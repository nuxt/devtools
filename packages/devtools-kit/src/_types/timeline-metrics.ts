import type ErrorStackParser from 'error-stack-parser'

export interface TimelineEventFunction {
  type: 'function'
  start: number
  end?: number

  name: string
  args?: any[]
  result?: any
  stacktrace?: ErrorStackParser.StackFrame[]
}

export interface TimelineEventRoute {
  type: 'route'
  start: number
  end?: number

  from: string
  to: string
}

export type TimelineEvent = TimelineEventFunction | TimelineEventRoute

export interface TimlineMetrics {
  events: TimelineEvent[]
  nonLiteralSymbol: symbol
}

export interface TimelineEventNormalized<T> {
  event: T
  segment: TimelineEventsSegment
  relativeStart: number
  relativeWidth: number
  layer: number
}

export interface TimelineEventsSegment {
  start: number
  end: number
  events: TimelineEvent[]
  functions: TimelineEventNormalized<TimelineEventFunction>[]
  routes: TimelineEventNormalized<TimelineEventRoute>[]
  duration: number
  previousGap?: number
}
