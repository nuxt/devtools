import { defineNuxtModule } from '@nuxt/kit'
import { defaultOptions } from './constant'
import type { ModuleGlobalOptions, ModuleOptions } from './types'
import { isGlobalInstall } from './dirs'

export type { ModuleOptions }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxt/devtools',
    configKey: 'devtools',
  },
  defaults: defaultOptions,
  setup(options, nuxt) {
    // Explicitly disabled
    if (options.enabled === false)
      return

    if (isGlobalInstall()) {
      // @ts-expect-error missing types
      const globalOptions = nuxt.options.devtoolsGlobal || {} as ModuleGlobalOptions
      if (options.enabled !== true && !globalOptions.projects?.includes(nuxt.options.rootDir))
        return
    }

    /**
     * Enable conditions:
     *
     * - `enabled` is NOT explicitly set to false
     * - Installed locally
     * - Installed globally, and enabled via `nuxi enable devtools`, or `enabled` is explicitly set to true
     */
    return import('./module-main').then(({ enableModule }) => enableModule(options, nuxt))
  },
})
