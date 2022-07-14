import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import Inspect from 'vite-plugin-inspect'

export default defineNuxtModule({
  meta: {
    name: 'inspect',
  },
  setup(_, nuxt) {
    if (!nuxt.options.dev)
      return

    addVitePlugin(Inspect())

    nuxt.hook('devtools:custom-tabs', (tabs) => {
      tabs.push({
        title: 'Inspect',
        name: 'inspect',
        icon: 'i-carbon-search',
        view: {
          type: 'iframe',
          src: '/__inspect',
        },
      })

      tabs.push({
        title: 'UnoCSS',
        name: 'unocss',
        icon: 'i-logos-unocss',
        view: {
          type: 'iframe',
          src: '/__unocss/',
        },
      })
    })
  },
})
