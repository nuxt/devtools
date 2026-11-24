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
    // The custom element mounts its own Vue app, early in the page. Hide it
    // from Vue DevTools, or it can register before the Nuxt app and become
    // the app selected by default, showing no Pinia stores.
    devtools: { hide: true },
  } as Parameters<typeof defineCustomElement>[1],
) as VueElementConstructor<{ props: NuxtDevToolsInspectorProps }>

customElements.define('nuxt-devtools-inspect-panel', NuxtDevtoolsInspectPanel)
