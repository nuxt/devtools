import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'

/**
 * Whether a connecting `ViteDevToolsNodeContext` is Nuxt's SSR Vite instance,
 * which should be skipped — only the browser-serving client instance should
 * register docks and connect the DevTools kit RPC.
 *
 * Nuxt's Vite 8 client and SSR resolved configs both expose `client` and
 * `ssr` environment names, so `config.environments` can't tell them apart.
 * `config.build.ssr` can: it's only truthy on the SSR build.
 */
export function skipInSSR(ctx: Pick<ViteDevToolsNodeContext, 'viteConfig'> | undefined): boolean {
  return Boolean(ctx?.viteConfig?.build?.ssr)
}
