import type { SourceMap } from 'magic-string'
import MagicString from 'magic-string'
import { findStaticImports, parseStaticImport } from 'mlly'
import { createUnplugin } from 'unplugin'

const HELPER_NAME = '__nuxtTimelineWrap'
const RENAME_PREFIX = '_$__'

export function importKey(source: string, name: string): string {
  return `${source}\0${name}`
}

export interface TimelineWrapOptions {
  helperPath: string
  /** Module ids that must never be wrapped, on top of the built-in excludes. */
  exclude?: RegExp[]
  /** Keys built with {@link importKey} for every import that should be wrapped. */
  getWrappable: () => Promise<ReadonlySet<string>>
}

// must run AFTER Nuxt's key injection and keyed function factory macro rewriting,
// so the caller is responsible for registering it after those plugins
export function TimelineWrapPlugin(options: TimelineWrapOptions) {
  return createUnplugin(() => ({
    name: 'nuxt:devtools:timeline-function-wrap',
    enforce: 'post',
    transform: {
      filter: {
        id: {
          include: [/^[^?]*\.(?:m?[jt]sx?|vue)(?:$|\?)/],
          exclude: [
            /^\0/,
            /[\\/]node_modules[\\/]/,
            /[?&]macro=true/,
            /[?&]type=(?:style|template|custom)\b/,
            ...options.exclude ?? [],
          ],
        },
        code: { include: /\bimport\b/ },
      },
      async handler(code) {
        const wrappable = await options.getWrappable()
        if (!wrappable.size)
          return
        return wrapTimelineImports(code, wrappable, options.helperPath)
      },
    },
  }))
}

export function wrapTimelineImports(
  code: string,
  wrappable: ReadonlySet<string>,
  helperPath: string,
): { code: string, map: SourceMap } | undefined {
  if (code.includes(HELPER_NAME))
    return

  const s = new MagicString(code)
  const wrappers: string[] = []

  for (const imp of findStaticImports(code)) {
    const { specifier, defaultImport, namespacedImport, namedImports } = parseStaticImport(imp)
    let wrapped = false

    // the local binding to import under: renamed when wrapped so the original name can hold the wrapper
    const importAs = (name: string, local: string): string => {
      if (!wrappable.has(importKey(specifier, name)))
        return local
      wrapped = true
      // a default import has no meaningful exported name, record it under its local name
      wrappers.push(`const ${local} = ${HELPER_NAME}(${JSON.stringify(name === 'default' ? local : name)}, ${RENAME_PREFIX}${local});`)
      return RENAME_PREFIX + local
    }

    const clause: string[] = []
    if (defaultImport)
      clause.push(importAs('default', defaultImport))
    if (namespacedImport)
      clause.push(`* as ${namespacedImport}`)
    const named = Object.entries(namedImports ?? {}).map(([name, local]) => {
      const bound = importAs(name, local)
      return name === bound ? name : `${name} as ${bound}`
    })

    if (named.length)
      clause.push(`{ ${named.join(', ')} }`)

    if (!wrapped)
      continue

    // rebuild only the clause between `import` and `from`, keeping the specifier untouched
    const clauseStart = imp.start + imp.code.indexOf(imp.imports)
    s.overwrite(clauseStart, clauseStart + imp.imports.length, `${clause.join(', ')} `)
  }

  if (!wrappers.length)
    return

  s.prepend([
    `import { ${HELPER_NAME} } from ${JSON.stringify(helperPath)};`,
    ...wrappers,
    '',
  ].join('\n'))

  return {
    code: s.toString(),
    map: s.generateMap({ hires: 'boundary' }),
  }
}
