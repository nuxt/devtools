import type { SourceMap } from 'magic-string'
import MagicString from 'magic-string'
import { findStaticImports, parseStaticImport } from 'mlly'

export const HELPER_NAME = '__nuxtTimelineWrap'
export const HELPER_NAME_RE = /__nuxtTimelineWrap/
const RENAME_PREFIX = '_$__'

export const TRANSFORM_ID_INCLUDE: RegExp[] = [
  /^[^?]*\.(?:m?[jt]sx?|vue)(?:$|\?)/,
]
export const TRANSFORM_ID_EXCLUDE: RegExp[] = [
  /^\0/,
  /[\\/]node_modules[\\/]/,
  /[?&]macro=true/,
  /[?&]type=(?:style|template|custom)\b/,
]

export function wrapTimelineImports(
  code: string,
  isWrappable: (source: string, name: string) => boolean,
  helperPath: string,
): { code: string, map: SourceMap } | undefined {
  if (!code.includes('import') || code.includes(HELPER_NAME))
    return

  const staticImports = findStaticImports(code)
  if (!staticImports.length)
    return

  const s = new MagicString(code)
  const wrappers: string[] = []

  for (const imp of staticImports) {
    const { specifier, defaultImport, namespacedImport, namedImports } = parseStaticImport(imp)
    let wrapped = false

    // returns the local binding for an imported name, renamed when it gets wrapped
    const bind = (name: string, local: string): string => {
      if (!isWrappable(specifier, name))
        return local
      wrapped = true
      // a default import has no meaningful exported name, record it under its local name
      wrappers.push(`const ${local} = ${HELPER_NAME}(${JSON.stringify(name === 'default' ? local : name)}, ${RENAME_PREFIX}${local});`)
      return RENAME_PREFIX + local
    }

    const clause: string[] = []
    if (defaultImport)
      clause.push(bind('default', defaultImport))
    if (namespacedImport)
      clause.push(`* as ${namespacedImport}`)
    const named = Object.entries(namedImports ?? {}).map(([name, local]) => {
      const bound = bind(name, local)
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
