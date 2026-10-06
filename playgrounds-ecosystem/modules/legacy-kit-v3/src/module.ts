// Written against @nuxt/devtools-kit v3 on purpose: every call below is a v4
// deprecation shim. This is what the published Nuxt 4 ecosystem still ships,
// so it has to keep working end to end against this repo's DevTools.
import { addCustomTab, extendServerRpc, onDevToolsInitialized, startSubprocess } from '@nuxt/devtools-kit'
import { createResolver, defineNuxtModule, extendPages } from '@nuxt/kit'

export const TAB_NAME = 'legacy-kit-v3'
export const PAGE_PATH = '/__legacy-kit-v3'
export const RPC_NAMESPACE = 'legacy-kit-v3'
export const TERMINAL_ID = 'legacy-kit-v3:echo'

export interface ServerFunctions {
  echo: (text: string) => string
}

export interface ClientFunctions {
  greet: (name: string) => void
}

export default defineNuxtModule({
  meta: { name: 'legacy-kit-v3' },
  setup(_options, nuxt) {
    if (!nuxt.options.dev)
      return

    const resolver = createResolver(import.meta.url)

    // The iframe view is a page of the host app itself, so its imports of
    // `@nuxt/devtools-kit/iframe-client` resolve to this package's v3 copy.
    extendPages((pages) => {
      pages.push({ name: TAB_NAME, path: PAGE_PATH, file: resolver.resolve('./runtime/legacy-kit-page.vue') })
    })

    addCustomTab({
      name: TAB_NAME,
      title: 'Legacy Kit v3',
      icon: 'carbon:time',
      view: { type: 'iframe', src: PAGE_PATH },
    })

    onDevToolsInitialized(() => {
      const rpc = extendServerRpc<ClientFunctions, ServerFunctions>(RPC_NAMESPACE, {
        echo(text) {
          rpc.broadcast.greet('legacy')
          return `${text.toUpperCase()} [from v3 rpc]`
        },
      })
    })

    startSubprocess(
      { command: 'node', args: ['-e', 'console.log("hello from a v3 subprocess")'] },
      { id: TERMINAL_ID, name: 'Legacy subprocess' },
    )
  },
})
