import type { Plugin } from 'vite'
import type { ViteInspectAPI, ViteInspectOptions } from 'vite-plugin-inspect'
import type { NuxtDevtoolsServerContext } from '../types'
import { addCustomTab } from '@nuxt/devtools-kit'
import { addVitePlugin } from '@nuxt/kit'

const DOUBLE_SLASH_RE = /\/\//g
const VERSION_QUERY_RE = /\?v=\w+$/
const VUE_EXT_RE = /\.vue($|\?v=)/

export async function createVitePluginInspect(options?: ViteInspectOptions): Promise<Plugin> {
  return await import('vite-plugin-inspect').then(r => r.default(options))
}

export async function setup({ nuxt, rpc }: NuxtDevtoolsServerContext) {
  const plugin = await createVitePluginInspect()
  addVitePlugin(plugin)

  let api: ViteInspectAPI | undefined

  nuxt.hook('vite:serverCreated', () => {
    api = plugin.api
  })

  addCustomTab(() => ({
    name: 'builtin-vite-inspect',
    title: 'Inspect',
    icon: 'carbon-ibm-watson-discovery',
    category: 'advanced',
    view: {
      type: 'iframe',
      src: `${nuxt.options.app.baseURL}${nuxt.options.app.buildAssetsDir}/__inspect/`.replace(DOUBLE_SLASH_RE, '/'),
    },
  }), nuxt)

  async function getComponentsRelationships() {
    const meta = await api?.rpc.getMetadata()
    const modules = (
      meta && meta.instances[0]
        ? await api?.rpc.getModulesList({
            vite: meta.instances[0].vite,
            env: meta.instances[0].environments[0]!,
          })
        : null
    ) || []

    const components = await rpc.functions.getComponents() || []
    const vueModules = modules.filter((m) => {
      const plainId = m.id.replace(VERSION_QUERY_RE, '')
      if (components.some(c => c.filePath === plainId))
        return true
      return m.id.match(VUE_EXT_RE)
    })

    const graph = vueModules.map((i) => {
      function searchForVueDeps(id: string, seen = new Set<string>()): string[] {
        if (seen.has(id))
          return []
        seen.add(id)
        const module = modules.find(m => m.id === id)
        if (!module)
          return []
        return module.deps.flatMap((i) => {
          if (vueModules.some(m => m.id === i))
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
