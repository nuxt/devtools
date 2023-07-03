export interface FunctionMetricCallRecord {
  name: string
  start: number
  end?: number
  args?: any[]
  result?: any
}

export interface FunctionMetrics {
  records: FunctionMetricCallRecord[]
  nonLiteralSymbol: symbol
}
