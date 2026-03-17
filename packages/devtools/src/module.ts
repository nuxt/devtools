import type { ModuleOptions } from './types'
import { defineNuxtModule } from '@nuxt/kit'
import { defaultOptions } from './constant'

export type { ModuleOptions }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxt/devtools',
    configKey: 'devtools',
  },
  defaults: defaultOptions,
  setup(options, nuxt) {
    // Disbale in test mode
    if (process.env.VITEST || process.env.TEST)
      return

    if (typeof options === 'boolean')
      options = { enabled: options }

    // Explicitly disabled
    if (options.enabled === false)
      return

    return import('./module-main').then(({ enableModule }) => enableModule(options as ModuleOptions, nuxt))
  },
})
