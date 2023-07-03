import { addTemplate, updateTemplates } from '@nuxt/kit'
import type { Import } from 'unimport'
import { toImports } from 'unimport'
import { resolve } from 'pathe'
import type { NuxtDevtoolsServerContext } from '../types'
import { runtimeDir } from '../dirs'

export async function setup({ nuxt }: NuxtDevtoolsServerContext) {
  const registedImports: Import[] = []
  const helperPath = resolve(runtimeDir, 'function-metrics-helpers')

  const template = addTemplate({
    filename: 'imports-injection.mjs',
    getContents() {
      const code = [
        '// @unimport-disable',
        `import { __wrapFunction } from ${JSON.stringify(helperPath)}`,
        toImports(registedImports),
        ...registedImports.flatMap((i) => {
          const name = i.as || i.name
          return [
            `const __${name}__ = __wrapFunction('${name}', ${name})`,
            `export { __${name}__ as ${name} }`,
          ]
        }),
      ].join('\n')

      return code
    },
  })

  let lastCount = 0

  nuxt.hook('imports:context', (unimport) => {
    const ctx = unimport.getInternalContext()
    ctx.addons.push(
      {
        extendImports(imports) {
          lastCount = imports.length
          const after = imports.map((i) => {
            if (i.type)
              return i

            // TODO: alllow custom filter
            if (i.from !== '#app')
              return i

            registedImports.push(i)
            return {
              ...i,
              typeFrom: i.from,
              from: '#build/imports-injection',
            }
          })

          if (lastCount !== after.length) {
            updateTemplates({
              filter: t => t.filename === template.filename,
            })
          }

          return after
        },
      },
    )
  })
}
