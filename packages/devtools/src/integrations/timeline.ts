import type { NuxtHooks, NuxtOptions } from '@nuxt/schema'
import type { Import } from 'unimport'
import type { NuxtDevtoolsServerContext } from '../types'
import { addBuildPlugin } from '@nuxt/kit'
import escapeRE from 'escape-string-regexp'
import { resolve } from 'pathe'
import { createUnplugin } from 'unplugin'
import { runtimeDir } from '../dirs'
import { HELPER_NAME_RE, TRANSFORM_ID_EXCLUDE, TRANSFORM_ID_INCLUDE, wrapTimelineImports } from './timeline-wrap'

const DEFINE_UPPER_RE = /^define[A-Z]/
const RUNTIME_DIR_RE = new RegExp(`^${escapeRE(runtimeDir)}`)
const IMPORT_RE = /\bimport\b/

export function setup({ nuxt, options }: NuxtDevtoolsServerContext) {
  const helperPath = resolve(runtimeDir, 'function-metrics-helpers')

  const includeFrom = options.timeline?.functions?.includeFrom || [
    '#app',
    '@unhead/vue',
  ]

  const include = options.timeline?.functions?.include || [
    i => includeFrom.includes(i.from),
    i => i.from.includes('composables'),
  ]

  const exclude = options.timeline?.functions?.exclude || [
    DEFINE_UPPER_RE,
  ]

  function filter(item: Import) {
    if (item.type)
      return false
    const name = item.as || item.name
    if (!include.some(f => typeof f === 'function' ? f(item) : typeof f === 'string' ? name === f : f.test(name)))
      return false
    if (exclude.some(f => typeof f === 'function' ? f(item) : typeof f === 'string' ? name === f : f.test(name)))
      return false
    return true
  }

  let unimport: Parameters<NuxtHooks['imports:context']>[0] | undefined
  nuxt.hook('imports:context', (ctx) => {
    unimport = ctx
  })

  // wrappable auto-imports keyed by `${source}\0${name}`, cached until the import list changes
  const wrappableCache = new WeakMap<Import[], Promise<Map<string, Import>>>()
  const resolvedFrom = new Map<string, Promise<string | undefined>>()

  async function getWrappable(): Promise<Map<string, Import>> {
    if (!unimport)
      return new Map()
    const imports = await unimport.getImports()
    let cached = wrappableCache.get(imports)
    if (!cached) {
      cached = buildWrappable(imports)
      wrappableCache.set(imports, cached)
    }
    return cached
  }

  async function buildWrappable(imports: Import[]): Promise<Map<string, Import>> {
    const map = new Map<string, Import>()
    // never wrap keyed-function factory macros (`createUseFetch`, etc.)
    // the option exists since Nuxt 4.4 and is not yet part of the schema types we build against (+ we need it as optional for backwards compat)
    const { keyedComposableFactories } = nuxt.options.optimization as NuxtOptions['optimization'] & {
      keyedComposableFactories?: { name: string }[]
    }
    const factoryNames = new Set(keyedComposableFactories?.map(f => f.name) ?? [])
    const ctx = unimport?.getInternalContext()

    // group by source so that each unique `from` is only resolved once
    const bySource = new Map<string, Import[]>()
    for (const i of imports) {
      if (!filter(i) || factoryNames.has(i.name))
        continue
      map.set(`${i.from}\0${i.name}`, i)
      const group = bySource.get(i.from)
      if (group)
        group.push(i)
      else
        bySource.set(i.from, [i])
    }

    if (!ctx?.resolveId)
      return map

    // unimport injects imports with the resolved specifier, which may differ from `i.from`
    await Promise.all(Array.from(bySource, async ([from, items]) => {
      let resolving = resolvedFrom.get(from)
      if (!resolving) {
        resolving = Promise.resolve(ctx.resolveId(from)).then(r => r || undefined, () => undefined)
        resolvedFrom.set(from, resolving)
      }
      const resolved = await resolving
      if (resolved && resolved !== from) {
        for (const i of items)
          map.set(`${resolved}\0${i.name}`, i)
      }
    }))
    return map
  }

  // the wrapping must happen AFTER Nuxt's key injection and keyed function factory macro rewriting

  // Nuxt registers these plugins in the `build:before` hook during core module setup, so we register ours
  // from `modules:done` to be queued after them
  nuxt.hook('modules:done', () => {
    nuxt.hook('build:before', () => {
      addBuildPlugin(createUnplugin(() => ({
        name: 'nuxt:devtools:timeline-function-wrap',
        enforce: 'post',
        transform: {
          filter: {
            id: {
              include: TRANSFORM_ID_INCLUDE,
              exclude: [
                ...TRANSFORM_ID_EXCLUDE,
                RUNTIME_DIR_RE,
              ],
            },
            code: {
              include: IMPORT_RE,
              exclude: HELPER_NAME_RE,
            },
          },
          async handler(code) {
            const wrappable = await getWrappable()
            if (!wrappable.size)
              return
            return wrapTimelineImports(code, (source, name) => wrappable.has(`${source}\0${name}`), helperPath)
          },
        },
      })))
    })
  })
}
