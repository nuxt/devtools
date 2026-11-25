import type { NuxtDevtoolsServerContext } from '../types'
import { addVitePlugin } from '@nuxt/kit'
import { VueTracer } from 'vite-plugin-vue-tracer'

export function setup({ nuxt, options }: NuxtDevtoolsServerContext) {
  if (!nuxt.options.dev || nuxt.options.test)
    return

  if (!options.componentInspector)
    return

  // `viteDevtools` adds vue-tracer's "Inspect Vue component" dock action.
  // Picks are handled by Nuxt's own inspect panel (see `plugins/view/client`)
  // instead of opening the editor right away.
  const plugin = VueTracer({
    viteDevtools: { onPick: 'none' },
  })
  if (plugin)
    addVitePlugin(plugin)
}
