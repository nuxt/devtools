import { defineNuxtModule } from '@nuxt/kit'

// TODO: demo only, should be contributed by modules
export default defineNuxtModule({
  meta: {
    name: 'custom-tabs',
  },
  setup(_, nuxt) {
    if (!nuxt.options.dev)
      return

    nuxt.hook('devtools:customTabs', () => {
      // todo
    })
  },
})
