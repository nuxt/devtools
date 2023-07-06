// @unimport-disable
import { markRaw, reactive } from 'vue'
import ErrorStackParser from 'error-stack-parser'
import type { TimelineEventFunction, TimlineMetrics } from '../types'

const nonLiteralSymbol = Symbol('nuxt-devtools-fn-metrics-non-literal')

function isLiteral(value: any) {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined
}

function getStacktrace() {
  // eslint-disable-next-line unicorn/error-message
  return ErrorStackParser.parse(new Error())
}

export function __initFunctionMetrics(): TimlineMetrics {
  if (process.server)
    return undefined!

  if (window.__NUXT_DEVTOOLS_TIMELINE_METRICS__)
    return window.__NUXT_DEVTOOLS_TIMELINE_METRICS__

  return window.__NUXT_DEVTOOLS_TIMELINE_METRICS__ = reactive(
    window.__NUXT_DEVTOOLS_TIMELINE_METRICS__ || {
      events: [],
      nonLiteralSymbol,
    },
  )
}

const wrapperFunctions = new WeakMap<any, any>()

export function __wrapFunction(name: string, fn: any) {
  if (process.server)
    return fn
  if (typeof fn !== 'function')
    return fn

  if (wrapperFunctions.has(fn))
    return wrapperFunctions.get(fn)!

  const metrics = __initFunctionMetrics()

  const wrappred = function (this: any, ...args: any[]) {
    const event: TimelineEventFunction = {
      type: 'function',
      name,
      start: Date.now(),
      args: markRaw(args.map(i => isLiteral(i) ? i : nonLiteralSymbol)), // TODO: replace non-literal args to avoid memory leak
      stacktrace: getStacktrace().slice(2),
    }
    metrics.events.push(event)
    const result = fn.apply(this, args)
    // handle promises
    if ('then' in result && typeof result.then === 'function') {
      return result
        .then((i: any) => i)
        .finally(() => {
          event.end = Date.now()
          return result
        })
    }
    event.end = Date.now()
    return result
  }

  Object.defineProperty(wrappred, 'length', { value: fn.name || name })
  wrapperFunctions.set(fn, wrappred)

  return wrappred
}
