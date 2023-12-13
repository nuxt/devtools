import { addVitePlugin } from '@nuxt/kit'
import type { Plugin } from 'vite'
import VueInspector from 'vite-plugin-vue-inspector'
import type { NuxtDevtoolsServerContext } from '../types'

export function setup({ options }: NuxtDevtoolsServerContext) {
  addVitePlugin(VueInspector({
    toggleComboKey: '',
    ...typeof options.componentInspector === 'boolean'
      ? {}
      : options.componentInspector,
    appendTo: /\/entry\.m?js$/,
    toggleButtonVisibility: 'never',
  }) as Plugin)
}
