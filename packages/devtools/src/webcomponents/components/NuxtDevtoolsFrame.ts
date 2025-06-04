import type { VueElementConstructor } from 'vue'
import { defineCustomElement } from 'vue'
import css from '../.generated/css'
import Component from './NuxtDevtoolsFrame.vue'

export const NuxtDevtoolsFrame = defineCustomElement(
  Component,
  {
    shadowRoot: true,
    styles: [css],
  },
) as VueElementConstructor

customElements.define('nuxt-devtools-frame', NuxtDevtoolsFrame)
