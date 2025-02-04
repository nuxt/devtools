import type { Nitro } from 'nitropack'
import type { ResolvedConfig } from 'vite'
import type { NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupServerDataRPC({
  nuxt,
  ensureDevAuthToken,
}: NuxtDevtoolsServerContext) {
  let nitro: Nitro | undefined
  let viteServer: ResolvedConfig | undefined
  let viteClient: ResolvedConfig | undefined

  // Avoid sending the Vite instance to the client
  function normalizeViteConfig(config: ResolvedConfig) {
    return {
      ...config,
      environments: Object.fromEntries(
        Object.entries(config.env).map(([key, _]) => {
          return [key, null]
        }),
      ),
      plugins: config.plugins.map((i) => {
        const clone = { ...i }
        delete clone.api
        return clone
      }),
      inlineConfig: null,
    } as any as ResolvedConfig
  }

  nuxt.hook('nitro:build:before', (_nitro) => {
    nitro = _nitro
  })

  nuxt.hook('vite:extendConfig', (vite, options) => {
    if (options.isServer) {
      vite.plugins ||= []
      vite.plugins.push({
        name: 'nuxt:devtools:config-retriever',
        enforce: 'post',
        configResolved(config) {
          viteServer = normalizeViteConfig(config)
        },
      })
    }
    else if (options.isClient) {
      vite.plugins ||= []
      vite.plugins.push({
        name: 'nuxt:devtools:config-retriever',
        enforce: 'post',
        configResolved(config) {
          viteClient = normalizeViteConfig(config)
        },
      })
    }
  })

  return {
    getServerConfig() {
      return nuxt.options
    },
    async getServerData(token: string) {
      await ensureDevAuthToken(token)
      return {
        nuxt: nuxt.options,
        nitro: nitro?.options,
        vite: {
          server: viteServer,
          client: viteClient,
        },
      }
    },
  } satisfies Partial<ServerFunctions>
}
