import { addVitePlugin } from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import type { Plugin } from 'vite'
import VueInspector from 'vite-plugin-vue-inspector'
import type { ServerFunctions } from '../types'

export async function setup(nuxt: Nuxt, _functions: ServerFunctions) {
  if (!nuxt.options.dev)
    return

  addVitePlugin(VueInspector({
    appendTo: 'entry.mjs',
    toggleComboKey: '',
    toggleButtonVisibility: 'never',
  }) as Plugin)
}
