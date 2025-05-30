import { defineCustomElement } from 'vue'
import css from '../.generated/css'
import Component from './NuxtDevtoolsInspectPanel.vue'

export const NuxtDevtoolsInspectPanel = defineCustomElement({
  ...Component,
  shadowRoot: true,
  styles: [css],
} as any)

customElements.define('nuxt-devtools-inspect-panel', NuxtDevtoolsInspectPanel)
