import { addVitePlugin } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ViteInspectAPI } from 'vite-plugin-inspect'
import type { ServerFunctions } from '../types'

export async function setupViteInspect(nuxt: Nuxt, _functions: ServerFunctions) {
  const plugin = await import('vite-plugin-inspect').then(r => (r.default || r)())
  addVitePlugin(plugin)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let api: ViteInspectAPI | undefined

  nuxt.hook('vite:serverCreated', () => {
    api = plugin.api
  })

  nuxt.hook('devtools:customTabs', (iframeTabs) => {
    iframeTabs.push({
      title: 'Vite Inspect',
      name: 'vite-inspect',
      builtin: true,
      icon: 'carbon-search',
      view: {
        type: 'iframe',
        src: `${nuxt.options.app.baseURL}/_nuxt/__inspect/`.replace(/\/\//g, '/'),
      },
    })
  })
}
