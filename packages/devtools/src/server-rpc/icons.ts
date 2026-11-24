import type { NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { loadNodeIcon } from '@iconify/utils/lib/loader/node-loader'
import { packageDir } from '../dirs'

/**
 * Resolve Iconify icons from locally installed `@iconify-json/*` (or
 * `@iconify/json`) packages, so the client never has to reach a CDN (#917).
 * The project is searched first, so a module's own icon collections win, then
 * the collections shipped with Nuxt DevTools.
 */
export function setupIconsRPC({ nuxt }: NuxtDevtoolsServerContext) {
  const cwd = [nuxt.options.rootDir, packageDir]

  return {
    async getIconSvg(collection: string, name: string) {
      try {
        return await loadNodeIcon(collection, name, { cwd, scale: 1.2 })
      }
      catch {
        return undefined
      }
    },
  } satisfies Partial<ServerFunctions>
}
