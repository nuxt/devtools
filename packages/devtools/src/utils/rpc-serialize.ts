import { parse, stringify } from 'structured-clone-es'

/**
 * Hardened (de)serialization for the DevTools RPC channel.
 *
 * The RPC runs over the Vite HMR WebSocket, which is reachable by anything that
 * can open a socket to the dev server. birpc assimilates thenables — it does
 * `await fn(...)` on every return value and `resolve(result)` on every response
 * — so any deserialized object that ends up being a thenable gets its `then`
 * invoked. `structured-clone-es` can, via its type-7 branch, deserialize a wire
 * payload into a real callable (`new globalThis[name](message)`, e.g.
 * `new Function("<attacker body>")`). Combined, that is a code-execution
 * primitive on the dev host that no per-method auth check can catch, because
 * deserialization happens before any handler runs (and responses are never
 * auth-checked at all).
 *
 * A legitimate RPC payload never contains a function: the serializer drops
 * function/symbol values. So the fix is simple and lossless for real traffic —
 * if a frame deserializes to a graph that contains any callable, treat it as
 * hostile and drop it (return an empty object, which birpc safely ignores)
 * before it can be awaited or assimilated.
 */
export { stringify as serializeRpc }

const DROPPED_MESSAGE = {}

export function deserializeRpc(data: any): any {
  const value = parse(data)
  if (containsCallable(value))
    return DROPPED_MESSAGE
  return value
}

function containsCallable(value: unknown, seen = new Set<unknown>()): boolean {
  if (typeof value === 'function')
    return true

  if (!value || typeof value !== 'object')
    return false

  if (seen.has(value))
    return false
  seen.add(value)

  if (Array.isArray(value))
    return value.some(item => containsCallable(item, seen))

  if (value instanceof Map) {
    for (const [key, item] of value) {
      if (containsCallable(key, seen) || containsCallable(item, seen))
        return true
    }
    return false
  }

  if (value instanceof Set) {
    for (const item of value) {
      if (containsCallable(item, seen))
        return true
    }
    return false
  }

  // Plain objects reconstructed by structured-clone-es only ever carry data
  // properties (no getters), so reading each own key is safe. This also catches
  // a callable smuggled in as a `then` property (the thenable-assimilation
  // gadget).
  for (const key of Object.keys(value)) {
    if (containsCallable((value as Record<string, unknown>)[key], seen))
      return true
  }

  return false
}
