import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import Inspect from 'vite-plugin-inspect'

// TODO: demo only, should be contributed by modules
export default defineNuxtModule({
  meta: {
    name: 'custom-tabs',
  },
  setup(_, nuxt) {
    if (!nuxt.options.dev)
      return

    addVitePlugin(Inspect())

    nuxt.hook('devtools:custom-tabs', (tabs) => {
      tabs.push({
        title: 'Inspect',
        name: 'inspect',
        icon: 'carbon-search',
        view: {
          type: 'iframe',
          src: `${nuxt.options.app.baseURL}/_nuxt/__inspect/`,
        },
      })

      tabs.push({
        title: 'UnoCSS',
        name: 'unocss',
        icon: 'logos-unocss',
        view: {
          type: 'iframe',
          src: '/__unocss/',
        },
      })
    })
  },
})
