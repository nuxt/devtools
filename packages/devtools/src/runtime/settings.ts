// @ts-expect-error virtual module
import _settings from '#build/devtools/settings'

import type { NuxtDevToolsOptions } from '@nuxt/devtools/types'

export const settings = _settings as {
  ui: NuxtDevToolsOptions['ui']
}
