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
// either. Resolving the SVG and inlining it ourselves sidesteps both problems —
// no CSS generation, no DOM root to get wrong.
//
// The SVG comes from a pluggable loader rather than a CDN, so the UI works
// offline and under strict CSP (#917). Nuxt DevTools resolves icons from the
// locally installed Iconify collections over its RPC. With no loader set,
// icons fall back to their UnoCSS class.

/** Resolves an icon to SVG markup, or `undefined` when it can't be found. */
export type IconifySvgLoader = (collection: string, name: string) => Promise<string | undefined>

let loader: IconifySvgLoader | undefined
const cache = new Map<string, Promise<string | undefined>>()

/**
 * Set the function that resolves icon SVGs, e.g. one that asks the dev server
 * to read them from local `@iconify-json/*` packages.
 */
export function setIconifySvgLoader(fn: IconifySvgLoader | undefined): void {
  loader = fn
  cache.clear()
}

async function loadSvg(collection: string, name: string): Promise<string | undefined> {
  try {
    const svg = await loader?.(collection, name)
    return svg
      ? DOMPurify.sanitize(svg, {
          USE_PROFILES: { svg: true },
        })
      : undefined
  }
  catch {
    // Degrade to the class fallback rather than throwing out of the caller's
    // async effect.
    return undefined
  }
}

/**
 * Resolve a UnoCSS-style icon id (`carbon-tree-view-alt`, `i-logos-vue`,
 * `carbon:settings`, ...) to inline, sanitized SVG markup through the loader
 * set with `setIconifySvgLoader`, cached in-memory. Returns `undefined` when
 * no loader is set, the id doesn't parse as a known Iconify collection, or the
 * icon can't be found.
 */
export function getIconifySvg(id: string): Promise<string | undefined> {
  if (!loader)
    return Promise.resolve(undefined)

  const cached = cache.get(id)
  if (cached)
    return cached

  const promise = parseIconWithLoader(id.replace(/^i-/, ''), loadSvg)
    .then(result => result?.svg)
    .catch(() => undefined)
  cache.set(id, promise)
  // Don't cache a failed lookup — a later render can retry it.
  promise.then(svg => svg === undefined && cache.delete(id))
  return promise
}
