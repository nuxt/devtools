import type { Import, Unimport } from 'unimport'
import type { NuxtDevtoolsServerContext } from '../types'
import { addBuildPlugin } from '@nuxt/kit'
import { resolve } from 'pathe'
import { runtimeDir } from '../dirs'
import { importKey, TimelineWrapPlugin } from './timeline-wrap'

const DEFINE_UPPER_RE = /^define[A-Z]/

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

  let unimport: Unimport | undefined
  nuxt.hook('imports:context', (ctx) => {
    unimport = ctx
  })

  async function getWrappable(): Promise<ReadonlySet<string>> {
    if (!unimport)
      return new Set()
    const imports = await unimport.getImports()
    // keyed function factories (`createUseFetch`, etc.) are compiler macros, calling them through a wrapper breaks them
    // (optional chaining: the option only exists since Nuxt 4.4)
    const factoryNames = new Set(nuxt.options.optimization.keyedComposableFactories?.map(f => f.name))
    return new Set(
      imports
        .filter(i => filter(i) && !factoryNames.has(i.name))
        .map(i => importKey(i.from, i.name)),
    )
  }

  // Nuxt registers its key injection plugins in `build:before` during core module setup, which runs after
  // this module's setup, so ours is queued from `modules:done` to land after them
  nuxt.hook('modules:done', () => {
    nuxt.hook('build:before', () => {
      addBuildPlugin(TimelineWrapPlugin({ helperPath, getWrappable }))
    })
  })
}
