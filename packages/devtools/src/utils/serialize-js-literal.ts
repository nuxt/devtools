export function toJsLiteral(value: any, seen = new Set()): string {
  // null
  if (value === null) {
    return 'null'
  }

  // undefined
  if (typeof value === 'undefined') {
    return 'undefined'
  }

  // Boolean or number
  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value)
  }

  // RegExp
  if (value instanceof RegExp) {
    // e.g., /pattern/gi
    return value.toString()
  }

  if (typeof value === 'function') {
    if (value.name) {
      return `function ${value.name}() { /* code */ }`
    }
    return 'function () { /* code */ }'
  }

  // String
  if (typeof value === 'string') {
    // Use JSON.stringify for correct escaping
    return JSON.stringify(value)
  }

  // Array
  if (Array.isArray(value)) {
    // Before recursing, check for cycles.
    if (seen.has(value)) {
      return '[Circular]'
    }
    seen.add(value)

    const elements = value.map(item => toJsLiteral(item, seen))
    const content = elements.join(', ')
    return `[${content}]`
  }

  // Object
  if (typeof value === 'object') {
    // Before recursing, check for cycles.
    if (seen.has(value)) {
      return '{Circular}'
    }
    seen.add(value)

    const entries = []
    for (const key of Object.keys(value)) {
      entries.push(`${safeKey(key)}: ${toJsLiteral(value[key], seen)}`)
    }
    if (entries.length === 0) {
      return '{}'
    }
    return `{ ${entries.join(', ')} }`
  }

  // Fallback
  return JSON.stringify(value)
}

/**
 * Safely wraps the key in quotes if it's not a valid JS identifier.
 */
function safeKey(key: string) {
  // A simple check for valid identifier names
  const validIdentifier = /^[a-z_$][\w$]*$/i
  if (validIdentifier.test(key)) {
    return key // leave as is
  }
  // otherwise, wrap in quotes
  return JSON.stringify(key)
}
