import type { ModuleCustomTab } from './custom-tabs'
import type { TerminalData } from './integrations'

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

    /**
     * Register a terminal.
     */
    'devtools:terminal:register': (terminal: TerminalData) => void
  }
}

declare module '@nuxt/schema' {
  /**
   * Runtime Hooks
   */
  interface RuntimeNuxtHooks {
    /**
     * On terminal data.
     */
    'devtools:terminal:data': (data: { id: string; data: string }) => void
  }
}

export {}
