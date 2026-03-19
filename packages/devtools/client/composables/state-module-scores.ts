import { watchDebounced } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useInstalledModules } from './state-modules'

export type ModuleStatus = 'optimal' | 'stable' | 'degraded' | 'critical'

export interface ModuleScore {
  name: string
  npm: string
  score: number
  status: ModuleStatus
  lastUpdated: string | null
}

// Version-specific score from nuxt.care /api/v1/score?slim=true
export interface VersionScoreSlim {
  name: string
  npm: string
  version: string
  latestVersion: string
  isLatest: boolean
  score: number
  latestScore: number | null
  status: ModuleStatus
  latestStatus: ModuleStatus | null
  recommendation: 'upgrade' | 'ok' | 'avoid'
  // Current version details
  deprecated: boolean
  vulnCount: number
  hasTests: boolean
  hasTypes: boolean
  daysSincePublish: number | null
  // Latest version details
  latestDeprecated: boolean | null
  latestVulnCount: number | null
  latestHasTests: boolean | null
  latestHasTypes: boolean | null
  // Repo-level info
  ciPassing: boolean | null
}

// nuxt.care color schema
export const statusColors: Record<ModuleStatus, string> = {
  optimal: '#22c55e',
  stable: '#84cc16',
  degraded: '#eab308',
  critical: '#ef4444',
}

// Age formatting helpers
export function formatAge(days: number | null | undefined, withSuffix = false): string {
  if (days == null)
    return '?'
  const suffix = withSuffix ? ' ago' : ''
  if (days < 30)
    return `${days}d${suffix}`
  if (days < 365)
    return `${Math.floor(days / 30)}mo${suffix}`
  return `${Math.floor(days / 365)}y${suffix}`
}

export function getAgeColor(days: number | null | undefined): string {
  if (days == null)
    return ''
  if (days < 90)
    return 'text-green-500'
  if (days < 365)
    return 'text-yellow-500'
  return 'text-red-400'
}

const API_BASE = 'https://nuxt.care/api/v1/modules/'
const scores = ref<Map<string, ModuleScore>>(new Map())
const fetched = new Set<string>()
const loading = ref(false)

export function useModuleScores() {
  const installedModules = useInstalledModules()

  const npmNames = computed(() =>
    installedModules.value
      .map(m => m.info?.npm || m.name)
      .filter((name): name is string => !!name && !name.startsWith('.')),
  )

  watchDebounced(npmNames, async (names) => {
    // Only fetch modules we haven't fetched yet
    const missing = names.filter(name => !fetched.has(name))
    if (!missing.length)
      return

    missing.forEach(name => fetched.add(name))
    loading.value = true

    try {
      const params = new URLSearchParams([
        ['slim', 'true'],
        ...missing.map(name => ['package', name]),
      ])

      const response = await $fetch<ModuleScore[]>(`${API_BASE}?${params}`)

      // Merge with existing scores
      for (const item of response)
        scores.value.set(item.npm, item)
    }
    catch (e: any) {
      // Only block retry for CORS or rate limit, allow retry for other errors
      const isCors = e?.message?.includes('NetworkError') || e?.message?.includes('CORS')
      const isRateLimit = (e?.response?.status ?? e?.status) === 429

      if (!isCors && !isRateLimit)
        missing.forEach(name => fetched.delete(name))

      console.warn('[DevTools] Failed to fetch module scores:', e)
    }
    finally {
      loading.value = false
    }
  }, { debounce: 300, immediate: true })

  return { scores, loading }
}
