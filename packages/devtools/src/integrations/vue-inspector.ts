import { addVitePlugin } from '@nuxt/kit'
import type { Plugin } from 'vite'
import VueInspector from 'vite-plugin-vue-inspector'
import type { NuxtDevtoolsServerContext } from '../types'

export async function setup({ nuxt }: NuxtDevtoolsServerContext) {
  if (!nuxt.options.dev)
    return

  addVitePlugin(VueInspector({
    appendTo: 'entry.mjs',
    toggleComboKey: '',
    toggleButtonVisibility: 'never',
  }) as Plugin)
}
