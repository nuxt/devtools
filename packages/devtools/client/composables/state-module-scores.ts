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

// nuxt.care color schema
export const statusColors: Record<ModuleStatus, string> = {
  optimal: '#22c55e',
  stable: '#84cc16',
  degraded: '#eab308',
  critical: '#ef4444',
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
