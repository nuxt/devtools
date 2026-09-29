import { parseIconWithLoader } from '@unocss/preset-icons/browser'
import DOMPurify from 'dompurify'

// The client can be embedded directly into a host page's DOM as a
// shadow-rooted custom element with no iframe of its own. UnoCSS's atomic
// classes (build-time and `@unocss/runtime` alike) inject/observe against
// `document`, which is the host page's single document either way — outside
// the shadow boundary, invisible to anything mounted inside it. Icons are the
// one part of this UI whose class names aren't all known at the client's own
// build time (an installed Nuxt module can report any Iconify id as its
// icon), so they can't be fully covered by the build-time UnoCSS extraction
// either. Fetching and inlining the SVG ourselves sidesteps both problems —
// no CSS generation, no DOM root to get wrong.
const cache = new Map<string, Promise<string | undefined>>()

async function fetchIconifySvg(collection: string, icon: string): Promise<string | undefined> {
  const url = `https://api.iconify.design/${collection}/${icon}.svg?color=currentColor&width=1.2em&height=1.2em`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok)
      return undefined
    return DOMPurify.sanitize(await res.text(), { USE_PROFILES: { svg: true } })
  }
  catch {
    // Offline / flaky CDN — degrade to a blank icon rather than throwing out
    // of the caller's async effect.
    return undefined
  }
}

/**
 * Resolve a UnoCSS-style icon id (`carbon-tree-view-alt`, `i-logos-vue`,
 * `carbon:settings`, ...) to inline, sanitized SVG markup, fetched from the
 * Iconify API and cached in-memory. Returns `undefined` when the id doesn't
 * parse as a known Iconify collection, or the fetch fails.
 */
export function getIconifySvg(id: string): Promise<string | undefined> {
  const cached = cache.get(id)
  if (cached)
    return cached

  const promise = parseIconWithLoader(id.replace(/^i-/, ''), fetchIconifySvg)
    .then(result => result?.svg)
    .catch(() => undefined)
  cache.set(id, promise)
  // Don't cache a failed lookup — a later render (e.g. once back online) can
  // retry it.
  promise.then(svg => svg === undefined && cache.delete(id))
  return promise
}
