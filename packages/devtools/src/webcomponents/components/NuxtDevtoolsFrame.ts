import type { VueElementConstructor } from 'vue'
import type { NuxtDevToolsInspectorProps } from './Props'
import { defineCustomElement } from 'vue'
import css from '../.generated/css'
import Component from './NuxtDevtoolsFrame.vue'

export const NuxtDevtoolsFrame = defineCustomElement({
  ...Component,
  shadowRoot: true,
  styles: [css],
} as any) as VueElementConstructor<{ props: NuxtDevToolsInspectorProps }>

customElements.define('nuxt-devtools-frame', NuxtDevtoolsFrame)
