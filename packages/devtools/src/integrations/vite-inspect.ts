import type { Plugin } from 'vite'
import type { ViteInspectOptions } from 'vite-plugin-inspect'
import type { NuxtDevtoolsServerContext } from '../types'
import { addVitePlugin, logger } from '@nuxt/kit'

const VERSION_QUERY_RE = /\?v=\w+$/
const VUE_EXT_RE = /\.vue($|\?v=)/

export async function createVitePluginInspect(options?: ViteInspectOptions): Promise<Plugin> {
  return await import('vite-plugin-inspect').then(r => r.default(options))
}

export async function setup({ rpc, rpcHost }: NuxtDevtoolsServerContext) {
  const plugin = await createVitePluginInspect()
  addVitePlugin(plugin)

  async function getComponentsRelationships() {
    if (!rpcHost?.has('vite-plugin-inspect:get-metadata')) {
      logger.warn('[nuxt-devtools] vite-plugin-inspect RPC functions not registered, component relationships unavailable')
      return []
    }

    const meta = await rpcHost.invokeLocal('vite-plugin-inspect:get-metadata' as any)
    const modules = (
      meta && meta.instances[0]
        ? await rpcHost.invokeLocal('vite-plugin-inspect:get-modules-list' as any, {
            vite: meta.instances[0].vite,
            env: meta.instances[0].environments[0]!,
          })
        : null
    ) || []

    const components = await rpc.functions.getComponents() || []
    const vueModules = modules.filter((m: any) => {
      const plainId = m.id.replace(VERSION_QUERY_RE, '')
      if (components.some(c => c.filePath === plainId))
        return true
      return m.id.match(VUE_EXT_RE)
    })

    const graph = vueModules.map((i: any) => {
      function searchForVueDeps(id: string, seen = new Set<string>()): string[] {
        if (seen.has(id))
          return []
        seen.add(id)
        const module = modules.find((m: any) => m.id === id)
        if (!module)
          return []
        return module.deps.flatMap((i: string) => {
          if (vueModules.some((m: any) => m.id === i))
            return [i]
          return searchForVueDeps(i, seen)
        })
      }

      return {
        id: i.id,
        deps: searchForVueDeps(i.id),
      }
    })

    return graph
  }

  rpc.functions.getComponentsRelationships = getComponentsRelationships
}
