import { computed } from 'vue'
import { useClient } from './client'

export interface PayloadBreakdown {
  key: string
  size: number
  percentage: number
  origin?: 'server' | 'client' | 'mixed'
}

export interface PayloadAnalysis {
  totalSize: number
  breakdown: PayloadBreakdown[]
  isLarge: boolean
  isCritical: boolean
}

const LARGE_PAYLOAD_THRESHOLD = 100 * 1024 // 100 KB
const CRITICAL_PAYLOAD_THRESHOLD = 500 * 1024 // 500 KB

const encoder = new TextEncoder()

function byteLength(str: string): number {
  return encoder.encode(str).length
}

/**
 * Estimate the serialized size (in bytes) of a payload value.
 *
 * Unlike `JSON.stringify`, this accounts for the rich types Nuxt's payload
 * serializer (devalue) supports (`Map`, `Set`, `Date`, `RegExp`, `BigInt`, ...)
 * and never throws on circular references (repeated references are counted once,
 * as devalue deduplicates them).
 */
export function measureSize(value: unknown, seen = new WeakSet<object>()): number {
  switch (typeof value) {
    case 'undefined':
      return 9 // `undefined`
    case 'string':
      return byteLength(JSON.stringify(value))
    case 'number':
    case 'boolean':
      return String(value).length
    case 'bigint':
      return value.toString().length + 1
    case 'symbol':
    case 'function':
      return 0
  }

  if (value === null)
    return 4

  const obj = value as object
  if (seen.has(obj))
    return 1 // reference to an already serialized value
  seen.add(obj)

  if (obj instanceof Date)
    return 26
  if (obj instanceof RegExp)
    return byteLength(JSON.stringify(obj.source)) + obj.flags.length + 2

  let size = 2
  if (obj instanceof Map) {
    for (const [k, v] of obj)
      size += measureSize(k, seen) + measureSize(v, seen) + 2
    return size
  }
  if (obj instanceof Set || Array.isArray(obj)) {
    for (const item of obj)
      size += measureSize(item, seen) + 1
    return size
  }
  for (const [k, v] of Object.entries(obj))
    size += byteLength(JSON.stringify(k)) + measureSize(v, seen) + 2
  return size
}

export function formatBytes(bytes: number): string {
  if (bytes === 0)
    return '0 B'
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function usePayloadAnalysis() {
  const client = useClient()

  const analysis = computed<PayloadAnalysis | null>(() => {
    const payload = client.value?.nuxt.payload
    if (!payload)
      return null

    const breakdown: PayloadBreakdown[] = []

    // Without SSR, everything in the payload was produced on the client.
    // With SSR, entries may come from the server render or from later
    // client-side fetches/updates (e.g. `useAsyncData({ server: false })`).
    const origin: PayloadBreakdown['origin'] = payload.serverRendered === false
      ? 'client'
      : 'mixed'

    const categories: [field: string, label: string][] = [
      ['state', 'State (useState)'],
      ['data', 'Data (useAsyncData)'],
      ['functions', 'Functions'],
    ]

    for (const [field, label] of categories) {
      const value = (payload as Record<string, unknown>)[field]
      if (value && typeof value === 'object') {
        breakdown.push({
          key: label,
          size: measureSize(value),
          percentage: 0,
          origin,
        })
      }
    }

    // Count all remaining payload fields so the total reflects the whole payload
    const known = new Set(categories.map(([field]) => field))
    const others = Object.fromEntries(
      Object.entries(payload).filter(([key]) => !known.has(key)),
    )
    const othersSize = Object.keys(others).length
      ? measureSize(others)
      : 0
    if (othersSize > 0) {
      breakdown.push({
        key: 'Other',
        size: othersSize,
        percentage: 0,
      })
    }

    const totalSize = breakdown.reduce((sum, item) => sum + item.size, 0)

    breakdown.forEach((item) => {
      item.percentage = totalSize > 0
        ? (item.size / totalSize) * 100
        : 0
    })

    breakdown.sort((a, b) => b.size - a.size)

    return {
      totalSize,
      breakdown,
      isLarge: totalSize > LARGE_PAYLOAD_THRESHOLD,
      isCritical: totalSize > CRITICAL_PAYLOAD_THRESHOLD,
    }
  })

  return {
    analysis,
    LARGE_PAYLOAD_THRESHOLD,
    CRITICAL_PAYLOAD_THRESHOLD,
  }
}
