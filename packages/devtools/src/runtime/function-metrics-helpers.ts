// @unimport-disable
import { parse as parseStrackTrace } from 'error-stack-parser-es'
import { markRaw, reactive } from 'vue'
import type { TimelineEventFunction, TimelineMetrics } from '@nuxt/devtools/types'
import { useObjectStorage } from './plugins/view/utils'

const nonLiteralSymbol = Symbol('nuxt-devtools-fn-metrics-non-literal')

// function isLiteral(value: any) {
//   return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined
// }

function getStacktrace() {
  // eslint-disable-next-line unicorn/error-message
  return parseStrackTrace(new Error())
}

export function initTimelineMetrics(): TimelineMetrics {
  if (import.meta.server)
    return undefined!

  if (window.__NUXT_DEVTOOLS_TIMELINE_METRICS__)
    return window.__NUXT_DEVTOOLS_TIMELINE_METRICS__

  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIMELINE_METRICS__', {
    value: reactive(
      window.__NUXT_DEVTOOLS_TIMELINE_METRICS__ || {
        events: [],
        nonLiteralSymbol,
        // TODO: sync with server config
        options: useObjectStorage('nuxt-devtools-timeline-metrics-options', {
          enabled: false,
          stacktrace: true,
          arguments: true,
        }),
      },
    ),
    enumerable: false,
    configurable: true,
  })

  return window.__NUXT_DEVTOOLS_TIMELINE_METRICS__!
}

const wrapperFunctions = new WeakMap<any, any>()

export function __nuxtTimelineWrap(name: string, fn: any) {
  if (import.meta.server)
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
    try {
      if (result && typeof result.then === 'function') {
        event.isPromise = true
        result
          .then((i: any) => i)
          .finally(() => {
            event.end = Date.now()
            return result
          })
        return result
      }
    }
    catch {}
    event.end = Date.now()
    return result
  }

  Object.defineProperty(wrappred, 'length', { value: fn.name || name })
  wrapperFunctions.set(fn, wrappred)

  return wrappred
}
