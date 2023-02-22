import { defineNuxtModule } from '@nuxt/kit'
import isInstalledGlobally from 'is-installed-globally'
import type { ModuleCustomTab, ModuleGlobalOptions, ModuleOptions } from './types'

export type { ModuleOptions }

declare module '@nuxt/schema' {
  interface NuxtHooks {
    /**
     * Called before devtools starts. Useful to detect if devtools is enabled.
     */
    'devtools:before': () => void

    /**
     * Called after devtools is initialized.
     */
    'devtools:initialized': () => void

    /**
     * Hooks to extend devtools tabs.
     */
    'devtools:customTabs': (tabs: ModuleCustomTab[]) => void

    /**
     * Retrigger update for custom tabs, `devtools:customTabs` will be called again.
     */
    'devtools:customTabs:refresh': () => void
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxt/devtools',
    configKey: 'devtools',
  },
  defaults: {
    enabled: undefined,
    vscode: {
      enabled: true,
      startOnBoot: false,
      port: 3080,
      reuseExistingServer: true,
    },
  },
  setup(options, nuxt) {
    // Explicitly disabled
    if (options.enabled === false)
      return

    if (isInstalledGlobally) {
      // @ts-expect-error missing types
      const globalOptions = nuxt.options.devtoolsGlobal || {} as ModuleGlobalOptions
      if (options.enabled !== true && !globalOptions.projects?.includes(nuxt.options.rootDir))
        return
    }

    /**
     * Enable conditions:
     *
     * - `enabled` is not explicitly set to false
     * - Installed locally
     * - Installed globally, and enabled via `nuxi enable devtools`, or `enabled` is explicitly set to true
     */
    return import('./module-main').then(({ enableModule }) => enableModule(options, nuxt))
  },
})
