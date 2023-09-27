import type { NuxtDevToolsOptions } from '../types'

// @ts-expect-error virtual module
import _settings from '#build/devtools/settings'

export const settings = _settings as {
  ui: NuxtDevToolsOptions['ui']
}
