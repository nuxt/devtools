import type ErrorStackParser from 'error-stack-parser'

export interface FunctionMetricCallRecord {
  name: string
  start: number
  end?: number
  args?: any[]
  result?: any
  stacktrace?: ErrorStackParser.StackFrame[]
}

export interface FunctionMetrics {
  records: FunctionMetricCallRecord[]
  nonLiteralSymbol: symbol
}
