import { onDevtoolsReady } from '@nuxt/devtools-kit'
import { createResolver, defineNuxtModule } from 'nuxt/kit'

const resolver = createResolver(import.meta.url)
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../../local' : '@nuxt/devtools'

export default defineNuxtConfig({
  modules: [
    /**
     * My module
     */
    '../src/module',
    devtoolsModule,
    /**
     * Start a sub Nuxt Server for developing the client
     *
     * The terminal output can be found in the built-in Terminals dock of the devtools.
     */
    defineNuxtModule({
      setup(_, nuxt) {
        if (!nuxt.options.dev || nuxt.options.test)
          return

        onDevtoolsReady((ctx) => {
          ctx.terminals.startChildProcess(
            {
              command: 'npx',
              args: ['nuxi', 'dev', '--port', '3300'],
              cwd: resolver.resolve('../client'),
            },
            {
              id: 'my-module:client',
              title: 'My Module Client Dev',
            },
          )
        })
      },
    }),
  ],
  myModule: {},
})
