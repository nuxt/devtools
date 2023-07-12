import { resolve } from 'pathe'
import type { Import } from 'unimport'
import type { NuxtDevtoolsServerContext } from '../types'
import { runtimeDir } from '../dirs'

export async function setup({ nuxt, options }: NuxtDevtoolsServerContext) {
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
    if (!include.some(f => typeof f === 'function' ? f(item) : typeof f === 'string' ? name.includes(f) : f.test(name)))
      return false
    if (exclude.some(f => typeof f === 'function' ? f(item) : typeof f === 'string' ? name.includes(f) : f.test(name)))
      return false
    return true
  }

  nuxt.hook('imports:context', (unimport) => {
    const ctx = unimport.getInternalContext()
    ctx.addons.push(
      {
        injectImportsResolved(imports) {
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
        injectImportsStringified(str, imports) {
          const injected = imports.filter(i => i.meta?.wrapperOriginalAs)
          if (injected.length) {
            const result = [
              str,
              `import { __wrapFunction } from ${JSON.stringify(helperPath)}`,
              ...injected.map(i => `const ${i.meta!.wrapperOriginalAs} = __wrapFunction(${JSON.stringify(i.name)}, ${i.as})`),
              '',
            ].join(';')
            return result
          }
        },
      },
    )
  })
}
