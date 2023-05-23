import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import type { ClientFunctions, ServerFunctions } from '../types'
import { setupDevToolsUI } from './devtools'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Enable Nuxt Devtools integration
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

    onDevToolsInitialized(() => {
      const rpc = extendServerRpc<ClientFunctions, ServerFunctions>('custom-rpc', {
        toUpperCase(t: string) {
          rpc.broadcast.greeting('world')
          return `${t.toUpperCase()} [from server]`
        },
      })
    })
  },
})
