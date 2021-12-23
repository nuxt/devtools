import { fileURLToPath } from 'url'
import { resolve } from 'path'
import { existsSync } from 'fs'
import { addComponentsDir, defineNuxtModule, installModule } from '@nuxt/kit'

import UnocssModule from '@unocss/nuxt'
import VueUseModule from '@vueuse/nuxt'
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
    addComponentsDir({ path: rPath('./components') })

    const presetStyles = resolve(options.preset, 'styles.css')
    if (existsSync(presetStyles)) { nuxt.options.css.push(presetStyles) }

    if (!options.dev) {
      nuxt.options.unocss = extendUnocssOptions(nuxt.options.unocss)
    }

    // @ts-expect-error
    nuxt.options.vueuse = Object.assign({ ssrHandlers: true }, nuxt.options.vueuse || {})

    await installModule(UnocssModule)
    await installModule(VueUseModule)
  }
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    nui?: {
      dev?: boolean
    }
  }
}
