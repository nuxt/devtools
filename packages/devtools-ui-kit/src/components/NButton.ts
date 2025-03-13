import type { PropType } from 'vue'
import { NuxtLink } from '#components'
import { defineComponent, h, renderSlot } from 'vue'
import NIcon from './NIcon.vue'

// @unocss-include
export default defineComponent({
  name: 'NButton',
  props: {
    to: String,
    icon: String,
    border: {
      type: Boolean,
      default: true,
    },
    disabled: Boolean,
    type: {
      type: String as PropType<'submit' | 'reset' | 'button'>,
      default: 'button',
    },
  },
  setup(props, { attrs, slots }) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore ignore types
    return () => h(props.to ? NuxtLink : 'button', {
      to: props.to,
      ...attrs,
      ...(!props.to && { type: props.type }),
      ...(props.disabled ? { disabled: true } : { tabindex: 0 }),
      class: [
        props.border ? 'n-button-base active:n-button-active focus-visible:n-focus-base hover:n-button-hover' : '',
        slots.default ? '' : 'n-icon-button',
        'n-button n-transition n-disabled:n-disabled',
      ].join(' '),
    }, [
      renderSlot(slots, 'icon', {}, () => props.icon
        ? [
            h(NIcon, {
              icon: props.icon,
              class: slots.default ? 'n-button-icon' : '',
            }),
          ]
        : []),
      renderSlot(slots, 'default'),
    ])
  },
})
