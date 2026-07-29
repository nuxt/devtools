/**
 * Decide whether an incoming RPC WebSocket connection may open a DevTools RPC
 * channel, based on its `Origin` / `Host` headers.
 *
 * The RPC runs over the Vite HMR socket, which has no origin check, so any site
 * a developer visits can connect to `ws://localhost:<port>/_nuxt/` and drive
 * the RPC from their browser (cross-site WebSocket hijacking). Browsers always
 * send an `Origin` on the WS handshake and it cannot be forged from page JS, so
 * requiring the origin to be same-origin with the dev server (its `Host`)
 * blocks that vector.
 *
 * A missing `Origin` means a non-browser client (Node HMR client, tooling,
 * tests) — those are a local/network actor, which is handled by the per-method
 * dev auth token rather than here, so they are allowed through.
 */
export function isAllowedRpcOrigin(
  origin: string | undefined | null,
  host: string | undefined | null,
): boolean {
  // Non-browser client (no Origin header) — not a CSWSH vector.
  if (!origin)
    return true

  let originHost: string
  try {
    originHost = new URL(origin).host
  }
  catch {
    // Malformed Origin — reject.
    return false
  }

  // Same-origin: the DevTools client is served by the dev server itself, so its
  // Origin host matches the request Host. A page on any other site will not.
  return !!host && originHost === host
}
