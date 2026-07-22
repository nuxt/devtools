import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'

export type ViteDevToolsContextClassification = 'client' | 'ssr' | 'unknown'

/**
 * Classify a connecting `ViteDevToolsNodeContext` as the browser-serving
 * client Vite instance, the SSR Vite instance, or unknown.
 *
 * Nuxt's Vite 8 client and SSR resolved configs both expose `client` and
 * `ssr` environment names, so `config.environments` cannot tell them apart.
 * `config.build.ssr` can: it is only truthy on the SSR build. Check it first.
 *
 * | Signal | Classification |
 * |---|---|
 * | `config.build.ssr` is truthy | `'ssr'` |
 * | `config.command === 'serve'` and `config.build.ssr` is falsy | `'client'` |
 * | missing config or any other combination | `'unknown'` |
 */
export function classifyViteDevToolsContext(ctx: Pick<ViteDevToolsNodeContext, 'viteConfig'> | undefined): ViteDevToolsContextClassification {
  const config = ctx?.viteConfig
  if (!config)
    return 'unknown'

  if (config.build?.ssr)
    return 'ssr'

  if (config.command === 'serve')
    return 'client'

  return 'unknown'
}
