import type { NuxtDevtoolsServerContext } from '../types'
import { createOgDevframe } from '@devframes/plugin-og'
import { NUXT_DEVTOOLS_GROUP_ID, onDevtoolsReady } from '@nuxt/devtools-kit'

/**
 * Mount the Open Graph Viewer Devframe into the Nuxt dock group. It replaces
 * the removed built-in Open Graph tab.
 */
export function setup({ nuxt }: NuxtDevtoolsServerContext): void {
  const definition = createOgDevframe({ defaultUrl: nuxt.options.devServer?.url })
  onDevtoolsReady((kit) => {
    return kit.install(definition, {
      dock: {
        groupId: NUXT_DEVTOOLS_GROUP_ID,
        category: 'analyze',
      },
    })
  }, nuxt)
}
