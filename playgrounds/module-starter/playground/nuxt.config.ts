import { startSubprocess } from '@nuxt/devtools-kit'
import { createResolver, defineNuxtModule } from 'nuxt/kit'

const resolver = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    /**
     * My module
     */
    '../src/module',
    '../../../local',
    /**
     * Start a sub Nuxt Server for developing the client
     *
     * The terminal output can be found in the Terminals tab of the devtools.
     */
    defineNuxtModule({
      setup(_, nuxt) {
        if (!nuxt.options.dev || nuxt.options.test)
          return

        const _process = startSubprocess(
          {
            command: 'npx',
            args: ['nuxi', 'dev', '--port', '3300'],
            cwd: resolver.resolve('../client'),
          },
          {
            id: 'my-module:client',
            name: 'My Module Client Dev',
          },
          nuxt,
        )
      },
    }),
  ],
  myModule: {},
})
