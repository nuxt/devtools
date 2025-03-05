import type { NuxtDevtoolsServerContext } from '../types'
import { addVitePlugin } from '@nuxt/kit'
import { VueTracer } from 'vite-plugin-vue-tracer'

export function setup({ nuxt, options }: NuxtDevtoolsServerContext) {
  if (!nuxt.options.dev || nuxt.options.test)
    return

  if (!options.componentInspector)
    return

  const plugin = VueTracer()
  if (plugin)
    addVitePlugin(plugin)
}
