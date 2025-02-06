import type { NuxtDevtoolsServerContext } from '../types'
import { addPluginTemplate, resolvePath } from '@nuxt/kit'
import { join } from 'pathe'
import { runtimeDir } from '../dirs'

export async function setup({ nuxt }: NuxtDevtoolsServerContext) {
  if (!nuxt.options.dev || nuxt.options.test)
    return

  addPluginTemplate({
    name: 'vue-devtools-client',
    mode: 'client',
    src: await resolvePath(join(runtimeDir, 'vue-devtools-client')),
  })
}
