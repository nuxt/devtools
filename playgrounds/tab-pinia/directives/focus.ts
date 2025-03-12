// todo: remove this once nuxt with directives folder here
import type { DirectiveBinding } from 'vue'

function mounted(el: HTMLElement, binding: DirectiveBinding) {
  // eslint-disable-next-line no-console
  console.log('mounted', el, binding)
}

function unmounted(el: HTMLElement, binding: DirectiveBinding) {
  // eslint-disable-next-line no-console
  console.log('unmounted', el, binding)
}

function updated(el: HTMLElement, binding: DirectiveBinding) {
  // eslint-disable-next-line no-console
  console.log('updated', el, binding)
}

export const Focus = {
  mounted,
  unmounted,
  updated,
}
