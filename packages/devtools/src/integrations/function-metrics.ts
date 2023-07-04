import { resolve } from 'pathe'
import type { NuxtDevtoolsServerContext } from '../types'
import { runtimeDir } from '../dirs'

export async function setup({ nuxt }: NuxtDevtoolsServerContext) {
  const helperPath = resolve(runtimeDir, 'function-metrics-helpers')

  const importForms = [
    '#app',
    '@unhead/vue',
    '@vueuse/core',
  ]

  nuxt.hook('imports:context', (unimport) => {
    const ctx = unimport.getInternalContext()
    ctx.addons.push(
      {
        injectImportsResolved(imports) {
          return imports.map((i) => {
            if (i.type)
              return i

            // TODO: alllow custom filter
            if (!importForms.includes(i.from) && !i.from.includes('composables'))
              return i

            const name = i.as || i.name
            if (name.startsWith('define'))
              return i

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
