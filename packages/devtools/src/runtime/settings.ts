import type { NuxtDevToolsOptions } from '@nuxt/devtools/types'

import _settings from '#build/devtools/settings'

export const settings = _settings as {
  ui: NuxtDevToolsOptions['ui']
}
