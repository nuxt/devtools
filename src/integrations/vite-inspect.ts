import { addVitePlugin } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

export async function setupViteInspect(nuxt: Nuxt) {
  if (nuxt.options.builder !== '@nuxt/vite-builder')
    return
  addVitePlugin(await import('vite-plugin-inspect').then(r => (r.default || r)()))

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
