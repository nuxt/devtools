import type { NuxtDevtoolsServerContext } from '../types'
import { createAssetsDevframe } from '@devframes/plugin-assets'
import { NUXT_DEVTOOLS_GROUP_ID, onDevtoolsReady } from '@nuxt/devtools-kit'
import { resolve } from 'pathe'
import { defaultAllowedExtensions } from '../constant'

/**
 * Mount the Assets Devframe into the Nuxt dock group. It replaces the removed
 * built-in Assets tab.
 */
export function setup({ nuxt, options }: NuxtDevtoolsServerContext): void {
  const definition = createAssetsDevframe({
    dir: resolve(nuxt.options.srcDir, nuxt.options.dir.public),
    baseURL: nuxt.options.app.baseURL,
    uploadExtensions: options.assets?.uploadExtensions || defaultAllowedExtensions,
  })
  onDevtoolsReady((kit) => {
    return kit.install(definition, {
      dock: {
        groupId: NUXT_DEVTOOLS_GROUP_ID,
        category: 'analyze',
      },
    })
  }, nuxt)
}
