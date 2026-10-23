import type { NuxtDevToolsOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { createDefaultTabOptions } from '../constant'
import { resolveEditorCommand } from '../utils/editor'
import { clearLocalOptions, readLocalOptions, writeLocalOptions } from '../utils/local-options'

interface OptionsCache {
  root: string
  options?: NuxtDevToolsOptions
  generation: number
  hasReadOnce: Set<keyof NuxtDevToolsOptions>
  pendingReads: Map<keyof NuxtDevToolsOptions, Promise<void>>
}

const caches = new WeakMap<NuxtDevtoolsServerContext['nuxt'], OptionsCache>()
let currentCache: OptionsCache | undefined

function createOptionsCache(root: string): OptionsCache {
  return {
    root,
    generation: 0,
    hasReadOnce: new Set(),
    pendingReads: new Map(),
  }
}

export function getOptions() {
  return currentCache?.options
}

async function readOptions<T extends keyof NuxtDevToolsOptions>(cache: OptionsCache, tab: T) {
  const generation = cache.generation
  // Source defaults fresh from `createDefaultTabOptions()` rather than the
  // cached `options![tab]`, so a dynamic default set after the cache was
  // first created — e.g. `serverTasks.enabled` toggled by Nitro's `tasks`
  // feature — is still honored the first time this tab is actually read.
  const loaded = await readLocalOptions<NuxtDevToolsOptions[T]>(createDefaultTabOptions()[tab], {
    root: cache.root,
    key: tab !== 'ui' && tab,
  })
  if (generation !== cache.generation || !cache.options)
    return

  cache.options[tab] = loaded
  if (tab === 'behavior')
    cache.options.behavior.openInEditor = resolveEditorCommand(cache.options.behavior.openInEditor)
  cache.hasReadOnce.add(tab)
}

/**
 * Read a tab's saved options once and return it. Unlike `getOptions()`, this
 * waits for the on-disk read, so callers cannot observe defaults while
 * `readLocalOptions()` is still pending.
 */
export async function ensureOptions<T extends keyof NuxtDevToolsOptions>(tab: T, nuxt: NuxtDevtoolsServerContext['nuxt']): Promise<NuxtDevToolsOptions[T]> {
  let cache = caches.get(nuxt)
  if (!cache) {
    cache = createOptionsCache(nuxt.options.rootDir)
    caches.set(nuxt, cache)
  }
  return readCachedOptions(cache, tab)
}

async function readCachedOptions<T extends keyof NuxtDevToolsOptions>(cache: OptionsCache, tab: T): Promise<NuxtDevToolsOptions[T]> {
  // `createDefaultTabOptions()` always returns a brand-new object graph, so
  // this can never alias (or leak mutations back into) another instance's
  // defaults the way sharing a single module-level constant used to.
  if (!cache.options)
    cache.options = createDefaultTabOptions()
  if (!cache.hasReadOnce.has(tab)) {
    let pending = cache.pendingReads.get(tab)
    if (!pending) {
      pending = readOptions(cache, tab).finally(() => {
        if (cache.pendingReads.get(tab) === pending)
          cache.pendingReads.delete(tab)
      })
      cache.pendingReads.set(tab, pending)
    }
    await pending
  }
  if (!cache.options)
    cache.options = createDefaultTabOptions()
  return cache.options[tab]
}

function resetOptionsCache(cache: OptionsCache) {
  cache.options = undefined
  cache.generation++
  cache.hasReadOnce.clear()
  cache.pendingReads.clear()
}

export function setupOptionsRPC({ nuxt }: NuxtDevtoolsServerContext) {
  const cache = createOptionsCache(nuxt.options.rootDir)
  caches.set(nuxt, cache)
  currentCache = cache

  async function getOptions<T extends keyof NuxtDevToolsOptions>(tab: T): Promise<NuxtDevToolsOptions[T]> {
    return readCachedOptions(cache, tab)
  }

  getOptions('ui')

  async function clearOptions() {
    resetOptionsCache(cache)
    await clearLocalOptions({
      root: nuxt.options.rootDir,
    })
  }

  return {
    async updateOptions(tab, _settings) {
      const settings = await getOptions(tab)
      Object.assign(settings, _settings)
      if (tab === 'behavior')
        cache.options!.behavior.openInEditor = resolveEditorCommand(cache.options!.behavior.openInEditor)
      await writeLocalOptions(
        { ...settings },
        {
          root: nuxt.options.rootDir,
          key: tab !== 'ui' && tab,
        },
      )
      nuxt.callHook('builder:generateApp', {
        filter(template) {
          return template.filename.includes('devtools/settings.js')
        },
      })
    },
    getOptions,
    clearOptions,
  } satisfies Partial<ServerFunctions>
}
