import { fileURLToPath } from 'node:url'
import { addComponentsDir, addImportsDir, createResolver, defineNuxtModule, installModule } from '@nuxt/kit'
import defu from 'defu'
import { extendUnocssOptions } from './unocss'

export { unocssPreset } from './unocss'

function rPath(p: string) {
  return fileURLToPath(new URL(p, import.meta.url).toString())
}

export interface ModuleOptions {
  dev?: boolean
  preset?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'devtools-ui-kit',
    configKey: 'devtoolsUIKit',
  },
  defaults: {
    preset: rPath('./preset'),
    dev: false,
  },
  async setup(options, nuxt) {
    // composables
    addImportsDir(rPath('./composables'))

    // Standard components
    addComponentsDir({ path: rPath('./components') })

    nuxt.options.css.unshift(rPath('assets/styles.css'))

    if (!options.dev)
      nuxt.options.unocss = extendUnocssOptions(nuxt.options.unocss)

    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore - module options
    nuxt.options.vueuse = nuxt.options.vueuse || {}
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore - module options
    nuxt.options.colorMode = defu(nuxt.options.colorMode, { classSuffix: '' })

    const resolver = createResolver(import.meta.url)
    await installModule(await resolver.resolvePath('@unocss/nuxt'))
    await installModule(await resolver.resolvePath('@vueuse/nuxt'))
    await installModule(await resolver.resolvePath('v-lazy-show/nuxt'))
  },
})
