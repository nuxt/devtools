import type { NuxtDevToolsOptions } from '@nuxt/devtools/types'

// Declared by `nuxi prepare` only in some setups, so `@ts-expect-error` would
// be unused in the others.
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore virtual module
import _settings from '#build/devtools/settings'

export const settings = _settings as {
  ui: NuxtDevToolsOptions['ui']
}
