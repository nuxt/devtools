import type { Nuxt } from 'nuxt/schema'

export type SetupMode = 'dev' | 'analyze-build' | 'unsupported-builder'

/**
 * What `enableModule()` sets up for this Nuxt instance, or `undefined` when
 * it does nothing. Kept free of runtime imports so the module entry can check
 * it before loading `module-main`.
 */
export function resolveSetupMode(nuxt: Nuxt): SetupMode | undefined {
  if (process.env.TEST || process.env.NODE_ENV === 'test' || nuxt.options.test)
    return

  if (nuxt.options.builder !== '@nuxt/vite-builder')
    return 'unsupported-builder'

  if (nuxt.options.dev)
    return 'dev'

  const analyze = nuxt.options.build.analyze
  if (analyze && (analyze === true || analyze.enabled))
    return 'analyze-build'
}
