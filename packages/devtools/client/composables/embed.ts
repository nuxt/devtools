/**
 * "Embedded" mode: a single tab loaded chromelessly inside a Vite DevTools dock
 * iframe, via the `/embed/<tab route>` sub-path. In this mode the app shell —
 * SideNav and split pane — is hidden so the iframe shows only the tab content.
 */
export const EMBED_PREFIX = '/embed'

export function isEmbeddedPath(path: string): boolean {
  return path === EMBED_PREFIX || path.startsWith(`${EMBED_PREFIX}/`)
}
