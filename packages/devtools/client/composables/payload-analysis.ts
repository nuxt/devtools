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

function calculateSize(value: any): number {
  if (value === null || value === undefined)
    return 0
  try {
    const str = JSON.stringify(value)
    return str
      ? new Blob([str]).size
      : 0
  }
  catch {
    return estimateSize(value)
  }
}

function estimateSize(value: any): number {
  if (typeof value === 'string')
    return value.length * 2
  if (typeof value === 'number')
    return 8
  if (typeof value === 'boolean')
    return 4
  if (Array.isArray(value))
    return value.reduce((sum: number, item: any) => sum + estimateSize(item), 0)
  if (typeof value === 'object')
    return Object.values(value).reduce((sum: number, val: any) => sum + estimateSize(val), 0)
  return 0
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
    let totalSize = 0

    if (payload.state && typeof payload.state === 'object') {
      const stateSize = calculateSize(payload.state)
      breakdown.push({
        key: 'State (useState)',
        size: stateSize,
        percentage: 0,
        origin: 'mixed',
      })
      totalSize += stateSize
    }

    if (payload.data && typeof payload.data === 'object') {
      const dataSize = calculateSize(payload.data)
      breakdown.push({
        key: 'Data (useAsyncData)',
        size: dataSize,
        percentage: 0,
        origin: 'server',
      })
      totalSize += dataSize
    }

    if (payload.functions && typeof payload.functions === 'object') {
      const functionsSize = calculateSize(payload.functions)
      breakdown.push({
        key: 'Functions',
        size: functionsSize,
        percentage: 0,
        origin: 'server',
      })
      totalSize += functionsSize
    }

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
