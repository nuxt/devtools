import type { Plugin } from 'vite'
import type { NuxtDevtoolsServerContext } from '../types'
import { addVitePlugin } from '@nuxt/kit'
import VueInspector from 'vite-plugin-vue-inspector'

export function setup({ nuxt, options }: NuxtDevtoolsServerContext) {
  if (!nuxt.options.dev || nuxt.options.test)
    return

  addVitePlugin(VueInspector({
    toggleComboKey: '',
    ...typeof options.componentInspector === 'boolean'
      ? {}
      : options.componentInspector,
    appendTo: /\/entry\.m?js$/,
    toggleButtonVisibility: 'never',
  }) as Plugin)
}
