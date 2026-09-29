import type { PluginWithDevTools } from '@vitejs/devtools-kit'
import type { NuxtDevtoolsServerContext } from '../types'
import { addPluginTemplate, addVitePlugin } from '@nuxt/kit'
import { vueDevtools } from 'vite-plugin-vue-devtools'
import { skipInSSR } from '../server-rpc/skip-in-ssr'

export function setup({ nuxt }: NuxtDevtoolsServerContext) {
  if (!nuxt.options.dev || nuxt.options.test)
    return

  // Added isomorphically — `{ server: false }` would strip the `devtools`
  // property (see the note in `module-main.ts`) — so guard the dock
  // registration against Nuxt's SSR Vite instance, which would otherwise
  // register a duplicate `vue-devtools` dock. Same pattern as the module's
  // own dock registration.
  // `vueDevtools()` always produces plain plugin objects; its declared
  // `PluginOption[]` return type is wider than that.
  const plugins = (vueDevtools() as PluginWithDevTools[]).map((plugin) => {
    const { devtools } = plugin
    if (!devtools?.setup)
      return plugin
    return {
      ...plugin,
      devtools: {
        ...devtools,
        setup: (ctx: Parameters<typeof devtools.setup>[0]) =>
          skipInSSR(ctx) ? undefined : devtools.setup(ctx),
      },
    }
  })
  addVitePlugin(plugins)

  // Nuxt has no Vite HTML entry for the plugin's own injection to hook into;
  // load the Vue DevTools client hook through an early Nuxt client plugin
  // instead.
  addPluginTemplate({
    filename: 'devtools/vue-devtools-client.mjs',
    name: 'vue-devtools-client',
    mode: 'client',
    order: -1_000,
    getContents: () => [
      `import 'virtual:vue-devtools-client'`,
      ``,
      `export default () => {}`,
      ``,
    ].join('\n'),
  })
}
