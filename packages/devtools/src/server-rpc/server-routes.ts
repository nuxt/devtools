import type { NitroConfig, NitroEventHandler } from 'nitropack'
import type { NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupServerRoutesRPC({ nuxt, refresh }: NuxtDevtoolsServerContext) {
  let nitroConfig: NitroConfig

  nuxt.hook('nitro:config', (config: any) => {
    nitroConfig = config
    refresh('getServerRoutes')
  })

  return {
    async getServerRoutes() {
      return (nitroConfig?.handlers || [])
        .filter(handler => handler?.route?.startsWith('/api/')) as NitroEventHandler[]
    },
  } satisfies Partial<ServerFunctions>
}
