import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import Inspect from 'vite-plugin-inspect'

export default defineNuxtModule({
  meta: {
    name: 'inspect',
  },
  setup(_, nuxt) {
    if (!nuxt.options.dev)
      return

    console.log('Hello')

    addVitePlugin(Inspect())

    nuxt.hook('devtools:custom-tabs', tabs=>{
      tabs.push({
        title: 'Inspect',
        name: 'inspect',
        view: {
          type: 'iframe',
          src: '/__inspect',
        }
      })
    })
  }
})
