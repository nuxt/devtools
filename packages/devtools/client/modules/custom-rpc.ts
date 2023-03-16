import { addPluginTemplate, defineNuxtModule } from '@nuxt/kit'
// @nuxt/devtools-kit
import { onDevToolsInitialized, registerServerRPC } from '../../../devtools-kit/src/index'

interface ServerFunctions {
  toUpperCase(t: string): string
}

interface ClientFunctions {
  greeting(t: string): string
}

// demo only
export default defineNuxtModule({
  meta: {
    name: 'custom-rpc',
  },
  setup(_, nuxt) {
    if (!nuxt.options.dev)
      return

    onDevToolsInitialized(() => {
      const rpc = registerServerRPC<ClientFunctions, ServerFunctions>('custom-rpc', {
        toUpperCase(t: string) {
          rpc.boardcast.greeting('world')
          return `${t.toUpperCase()} [from server]`
        },
      })
    })

    addPluginTemplate({
      filename: 'custom-rpc.ts',
      getContents() {
        return `
          import { onDevToolsClientConnected } from '@nuxt/devtools-kit/iframe-client'

          export default () => {
            onDevToolsClientConnected((client) => {
              const rpc = client.devtools.extendClientRpc('custom-rpc', {
                greeting(t: string) {
                  console.log(\`[custom-rpc] Hello \${t}!\`)
                },
              })

              rpc.toUpperCase('[custom-rpc] hello')
                .then(console.log)
                .catch(console.error)
            })
          }
        `
      },
    })
  },
})
