import type { StackFrame } from 'error-stack-parser-es'

export interface TimelineEventFunction {
  type: 'function'
  start: number
  end?: number

  name: string
  args?: any[]
  result?: any
  stacktrace?: StackFrame[]
}

export interface TimelineEventRoute {
  type: 'route'
  start: number
  end?: number

  from: string
  to: string
}

export interface TimelineOptions {
  enabled: boolean
  stacktrace: boolean
  arguments: boolean
}

export type TimelineEvent = TimelineEventFunction | TimelineEventRoute

export interface TimelineMetrics {
  events: TimelineEvent[]
  nonLiteralSymbol: symbol
  options: TimelineOptions
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
  route?: TimelineEventNormalized<TimelineEventRoute>
  duration: number
  previousGap?: number
}
