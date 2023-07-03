import { markRaw, reactive } from 'vue'
import type { FunctionMetricCallRecord } from '../types'

const nonLiteralSymbol = Symbol('nuxt-devtools-fn-metrics-non-literal')

function isLiteral(value: any) {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined
}

export function __wrapFunction(name: string, fn: Function) {
  if (process.server)
    return fn

  const metrics = window.__NUXT_DEVTOOLS_FN_METRICS__ = reactive(
    window.__NUXT_DEVTOOLS_FN_METRICS__ || {
      records: [],
      nonLiteralSymbol,
    },
  )

  return function (this: any, ...args: any[]) {
    const record: FunctionMetricCallRecord = {
      name,
      start: Date.now(),
      args: markRaw(args.map(i => isLiteral(i) ? i : nonLiteralSymbol)), // TODO: replace non-literal args to avoid memory leak
    }
    metrics.records.push(record)
    const result = fn.apply(this, args)
    // handle promises
    if ('finally' in result && typeof result.finally === 'function') {
      return result.finally(() => {
        record.end = Date.now()
        return result
      })
    }
    record.end = Date.now()
    return result
  }
}
