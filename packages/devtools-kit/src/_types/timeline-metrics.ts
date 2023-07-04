import type ErrorStackParser from 'error-stack-parser'

export interface TimelineFunctionRecord {
  name: string
  start: number
  end?: number
  args?: any[]
  result?: any
  stacktrace?: ErrorStackParser.StackFrame[]
}

export interface TimelineRouteRecord {
  from: string
  to: string
  start: number
  end?: number
}

export interface TimlineMetrics {
  functions: TimelineFunctionRecord[]
  routes: TimelineRouteRecord[]
  nonLiteralSymbol: symbol
}
