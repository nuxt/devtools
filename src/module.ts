import { defineNuxtModule } from '@nuxt/kit'
import isInstalledGlobally from 'is-installed-globally'
import type { ModuleCustomTab, ModuleOptions } from './types'

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
    enableCustomTabs: true,
    vscode: {
      enabled: true,
      startOnBoot: false,
      port: 3080,
      reuseExistingServer: true,
    },
  },
  setup(options, nuxt) {
    if (!isInstalledGlobally)
      return import('./module-entry').then(({ enableModule }) => enableModule(options, nuxt))

    // installed globally
    if (options.enabledProjects?.includes(nuxt.options.rootDir))
      return import('./module-entry').then(({ enableModule }) => enableModule(options, nuxt))

    // not enabled for this project
  },
})
