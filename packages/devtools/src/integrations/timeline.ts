import { resolve } from 'pathe'
import semver from 'semver'
import type { Import } from 'unimport'
import { runtimeDir } from '../dirs'
import type { NuxtDevtoolsServerContext } from '../types'

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
    /^define[A-Z]/,
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

  nuxt.hook('imports:context', (unimport) => {
    const ctx = unimport.getInternalContext()

    if (!ctx.version || !semver.gte(ctx.version, '3.1.0'))
      throw new Error(`[Nuxt DevTools] The timeline feature requires \`unimport\` >= v3.1.0, but got \`${ctx.version || '(unknown)'}\`. Please upgrade using \`nuxi upgrade --force\`.`)

    ctx.addons.push(
      {
        injectImportsResolved(imports, _code, id) {
          if (id?.includes('?macro=true'))
            return
          return imports.map((i) => {
            if (!filter(i))
              return i

            const name = i.as || i.name

            return {
              ...i,
              meta: {
                wrapperOriginalAs: name,
              },
              as: `_$__${name}`,
            }
          })
        },
        injectImportsStringified(str, imports, s, id) {
          if (id?.includes('?macro=true'))
            return
          const code = s.toString()
          const injected = imports.filter(i => i.meta?.wrapperOriginalAs)
          if (injected.length) {
            const result = [
              str,
              code.includes('__nuxtTimelineWrap')
                ? ''
                : `import { __nuxtTimelineWrap } from ${JSON.stringify(helperPath)}`,
              ...injected.map(i => `const ${i.meta!.wrapperOriginalAs} = __nuxtTimelineWrap(${JSON.stringify(i.name)}, ${i.as})`),
              '',
            ].join(';')
            return result
          }
        },
      },
    )
  })
}
