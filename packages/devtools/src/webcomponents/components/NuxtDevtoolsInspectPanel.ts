import type { VueElementConstructor } from 'vue'
import type { NuxtDevToolsInspectorProps } from './Props'
import { defineCustomElement } from 'vue'
import css from '../.generated/css'
import Component from './NuxtDevtoolsInspectPanel.vue'

export const NuxtDevtoolsInspectPanel = defineCustomElement(
  Component,
  {
    shadowRoot: true,
    styles: [css],
  },
) as VueElementConstructor<{ props: NuxtDevToolsInspectorProps }>

customElements.define('nuxt-devtools-inspect-panel', NuxtDevtoolsInspectPanel)
