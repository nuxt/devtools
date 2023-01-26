import { addVitePlugin } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
// import type { ViteInspectAPI } from 'vite-plugin-inspect'
import Inspect from 'vite-plugin-inspect'
import type { ServerFunctions } from '../types'

export async function setup(nuxt: Nuxt, _functions: ServerFunctions) {
  const plugin = Inspect()
  addVitePlugin(plugin)

  // let _api: ViteInspectAPI | undefined

  // nuxt.hook('vite:serverCreated', () => {
  //   _api = plugin.api
  // })

  nuxt.hook('devtools:customTabs', (iframeTabs) => {
    iframeTabs.push({
      title: 'Inspect',
      name: 'vite-inspect',
      icon: 'carbon-search',
      view: {
        type: 'iframe',
        src: `${nuxt.options.app.baseURL}/_nuxt/__inspect/`.replace(/\/\//g, '/'),
      },
    })
  })
}
