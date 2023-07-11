// @unimport-disable
import { markRaw, reactive } from 'vue'
import ErrorStackParser from 'error-stack-parser'
import type { TimelineEventFunction, TimelineMetrics } from '../types'

const nonLiteralSymbol = Symbol('nuxt-devtools-fn-metrics-non-literal')

// function isLiteral(value: any) {
//   return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined
// }

function getStacktrace() {
  // eslint-disable-next-line unicorn/error-message
  return ErrorStackParser.parse(new Error())
}

export function initTimelineMetrics(): TimelineMetrics {
  if (process.server)
    return undefined!

  if (window.__NUXT_DEVTOOLS_TIMELINE_METRICS__)
    return window.__NUXT_DEVTOOLS_TIMELINE_METRICS__

  return window.__NUXT_DEVTOOLS_TIMELINE_METRICS__ = reactive(
    window.__NUXT_DEVTOOLS_TIMELINE_METRICS__ || {
      events: [],
      nonLiteralSymbol,
      // TODO: sync with server config
      options: {
        enabled: true,
        stacktrace: true,
        arguments: true,
      },
    },
  )
}

const wrapperFunctions = new WeakMap<any, any>()

export function __wrapFunction(name: string, fn: any) {
  if (process.server)
    return fn
  if (typeof fn !== 'function')
    return fn

  const metrics = initTimelineMetrics()

  if (wrapperFunctions.has(fn))
    return wrapperFunctions.get(fn)!

  const wrappred = function (this: any, ...args: any[]) {
    if (!metrics.options.enabled)
      return fn.apply(this, args)

    const event: TimelineEventFunction = {
      type: 'function',
      name,
      start: Date.now(),
      args: metrics.options.arguments
        ? markRaw(args)
        : undefined,
      stacktrace: metrics.options.stacktrace
        ? getStacktrace().slice(2)
        : undefined,
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
