import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  async setup(_) {
    const { resolve } = createResolver(import.meta.url)

    const runtime = './runtime'

    addServerHandler({
      route: '/api/hello-from-custom-module',
      method: 'get',
      handler: resolve(runtime, 'server/api/hello'),
    })
  },
})
