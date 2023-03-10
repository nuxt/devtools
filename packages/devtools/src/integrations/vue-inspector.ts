import { addVitePlugin } from '@nuxt/kit'
import type { Plugin } from 'vite'
import VueInspector from 'vite-plugin-vue-inspector'
import type { RPCContext } from '../server-rpc/types'

export async function setup({ nuxt }: RPCContext) {
  if (!nuxt.options.dev)
    return

  addVitePlugin(VueInspector({
    appendTo: 'entry.mjs',
    toggleComboKey: '',
    toggleButtonVisibility: 'never',
  }) as Plugin)
}
