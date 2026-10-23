import type { NuxtDevToolsOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { createDefaultTabOptions } from '../constant'
import { resolveEditorCommand } from '../utils/editor'
import { clearLocalOptions, readLocalOptions, writeLocalOptions } from '../utils/local-options'

let options: NuxtDevToolsOptions | undefined
let optionsRoot: string | undefined
const hasReadOnce = new Set<keyof NuxtDevToolsOptions>()

export function getOptions() {
  return options
}

async function readOptions<T extends keyof NuxtDevToolsOptions>(tab: T) {
  if (!optionsRoot)
    return options

  // Source defaults fresh from `createDefaultTabOptions()` rather than the
  // cached `options![tab]`, so a dynamic default set after the cache was
  // first created — e.g. `serverTasks.enabled` toggled by Nitro's `tasks`
  // feature — is still honored the first time this tab is actually read.
  options![tab] = await readLocalOptions<NuxtDevToolsOptions[T]>(createDefaultTabOptions()[tab], {
    root: optionsRoot,
    key: tab !== 'ui' && tab,
  })
  if (tab === 'behavior')
    options!.behavior.openInEditor = resolveEditorCommand(options!.behavior.openInEditor)
  hasReadOnce.add(tab)
  return options
}

/**
 * Read a tab's saved options once and return it. Unlike `getOptions()`, this
 * waits for the on-disk read, so callers cannot observe defaults while
 * `readLocalOptions()` is still pending.
 */
export async function ensureOptions<T extends keyof NuxtDevToolsOptions>(tab: T): Promise<NuxtDevToolsOptions[T]> {
  // `createDefaultTabOptions()` always returns a brand-new object graph, so
  // this can never alias (or leak mutations back into) another instance's
  // defaults the way sharing a single module-level constant used to.
  if (!options)
    options = createDefaultTabOptions()
  if (!hasReadOnce.has(tab))
    await readOptions(tab)
  return options[tab]
}

export function setupOptionsRPC({ nuxt }: NuxtDevtoolsServerContext) {
  optionsRoot = nuxt.options.rootDir

  async function getOptions<T extends keyof NuxtDevToolsOptions>(tab: T): Promise<NuxtDevToolsOptions[T]> {
    return ensureOptions(tab)
  }

  getOptions('ui')

  async function clearOptions() {
    options = undefined
    hasReadOnce.clear()
    await clearLocalOptions({
      root: nuxt.options.rootDir,
    })
  }

  return {
    async updateOptions(tab, _settings) {
      const settings = await getOptions(tab)
      Object.assign(settings, _settings)
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
