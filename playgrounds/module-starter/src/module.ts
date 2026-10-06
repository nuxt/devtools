import { onDevtoolsReady } from '@nuxt/devtools-kit'
import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { setupDevToolsUI } from './devtools'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Enable Nuxt DevTools integration
   *
   * @default true
   */
  devtools: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    devtools: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    if (options.devtools)
      setupDevToolsUI(nuxt, resolver)

    onDevtoolsReady((ctx) => {
      // Everything registered through the scope is prefixed with `my-module:`
      const { rpc } = ctx.scope('my-module')

      rpc.register({
        name: 'to-upper-case',
        type: 'query',
        handler(t: string) {
          // call the client function registered by the iframe
          rpc.broadcast({ method: 'greeting', args: ['world'], event: true })
          return `${t.toUpperCase()} [from server]`
        },
      })
    })
  },
})
