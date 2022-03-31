import { fileURLToPath } from 'url'
import { addComponentsDir, defineNuxtModule, installModule } from '@nuxt/kit'
import defu from 'defu'
import UnocssModule from '@unocss/nuxt'
import VueUseModule from '@vueuse/nuxt'
import NuxtColorMode from '@nuxtjs/color-mode'
import { extendUnocssOptions } from './unocss'

const rPath = (p: string) => fileURLToPath(new URL(p, import.meta.url).toString())

export default defineNuxtModule({
  meta: {
    name: 'nui',
    configKey: 'nui'
  },
  defaults: {
    preset: rPath('./preset'),
    dev: false
  },
  async setup (options, nuxt) {
    // Nuxt overrides
    addComponentsDir({ path: rPath('./components/nuxt') })

    // Standard components
    addComponentsDir({ path: rPath('./components') })

    nuxt.options.css.unshift(rPath('assets/styles.css'))

    if (!options.dev) {
      nuxt.options.unocss = extendUnocssOptions(nuxt.options.unocss)
    }

    nuxt.options.vueuse = Object.assign({ ssrHandlers: true }, nuxt.options.vueuse || {})
    nuxt.options.colorMode = defu(nuxt.options.colorMode, { classSuffix: '' })

    await installModule(UnocssModule)
    await installModule(VueUseModule)
    await installModule(NuxtColorMode)
  }
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    nui?: {
      dev?: boolean
    }
  }
}
