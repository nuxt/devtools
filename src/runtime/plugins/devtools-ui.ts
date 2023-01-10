import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import { setupHooksDebug } from '../shared/hooks'
import type { NuxtDevtoolsGlobal } from '../../types'
import { defineNuxtPlugin } from '#app'

declare global {
  interface Window {
    __NUXT_DEVTOOLS__?: NuxtDevtoolsGlobal
    __VUE_INSPECTOR__?: VueInspectorClient
  }
}

function h<K extends keyof HTMLElementTagNameMap>(
  type: K,
  props: Partial<Omit<HTMLElementTagNameMap[K], 'style'>> & {
    style?: Partial<CSSStyleDeclaration>
  } = {},
  children?: HTMLElement[],
  setup?: (el: HTMLElementTagNameMap[K]) => void,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(type)
  const { style, ...attrs } = props
  Object.assign(el, attrs)
  if (style)
    Object.assign(el.style, style)
  if (children)
    children.forEach(c => el.appendChild(c))
  if (setup)
    setup(el)
  return el
}

const LAYOUT_IFRAME = {
  position: 'fixed',
  bottom: '10px',
  right: '10px',
  left: '10px',
  height: '600px',
  borderRadius: '0.5rem',
  maxHeight: 'calc(100vh - 20px)',
  width: 'calc(100vw - 20px)',
}

const LAYOUT_IFRAME_SMALL = {
  position: 'fixed',
  bottom: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '300px',
  height: '60px',
  borderRadius: '0.5rem',
}

export default defineNuxtPlugin((nuxt) => {
  if (typeof document === 'undefined' || typeof window === 'undefined' || window.self !== window.top)
    return

  const CLIENT_PATH = '/__nuxt_devtools__/client/'
  // const ENTRY_PATH = '/__nuxt_devtools__/entry/'

  const clientHooks = setupHooksDebug(nuxt.hooks)

  // function post(method: string, data: any) {
  //   return fetch(ENTRY_PATH, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       method,
  //       data: stringify(data),
  //     }),
  //   })
  //     .catch()
  // }

  const iframe = h('iframe', {
    src: CLIENT_PATH,
    className: 'nuxt-devtools-iframe',
    style: {
      height: '100%',
      width: '100%',
      borderRadius: '0.5rem',
      overflow: 'auto',
      outline: 'none',
      border: '1px solid rgba(125,125,125,0.2)',
      boxShadow: '3px 5px 8px rgba(0,0,0,0.05)',
    },
  })

  iframe.addEventListener('load', () => {
    updateClient()
    setTimeout(updateClient, 1000)
  })

  const closeButton = h('button', {
    className: 'nuxt-devtools-close-button',
    style: {
      position: 'absolute',
      top: '5px',
      right: '0',
      zIndex: '99999',
      height: '2rem',
      width: '2rem',
      padding: '5px',
    },
  }, [], el => el.addEventListener('click', toggle))

  const container = h('div', {
    className: 'nuxt-devtools-container',
    style: LAYOUT_IFRAME,
  },
  [
    iframe,
    closeButton,
  ])

  function toggle() {
    if (Array.from(document.body.children).includes(container)) {
      const isOpen = container.style.display !== 'none'
      if (!isOpen)
        container.style.display = 'block'
      else if (window.__VUE_INSPECTOR__?.enabled) // inspector enabled, exit first
        disableComponentInspector()
      else
        container.style.display = 'none'
    }
    else {
      document.body.appendChild(container)
      iframe.contentDocument!.body.parentElement!.className = document.body.parentElement!.className
      updateClient()
    }
  }

  function enableComponentInspector() {
    window.__VUE_INSPECTOR__?.enable()
    container.removeAttribute('style')
    Object.assign(container.style, LAYOUT_IFRAME_SMALL)
  }

  function disableComponentInspector() {
    window.__VUE_INSPECTOR__?.disable()
    container.removeAttribute('style')
    Object.assign(container.style, LAYOUT_IFRAME)
    window.__NUXT_DEVTOOLS__?.componentInspectorClose()
  }

  function updateClient() {
    const injection = iframe?.contentWindow?.__NUXT_DEVTOOLS__ as NuxtDevtoolsGlobal
    const componentInspector = window.__VUE_INSPECTOR__ as VueInspectorClient

    if (componentInspector) {
      componentInspector.openInEditor = (baseUrl, file, line, column) => {
        window.__NUXT_DEVTOOLS__?.componentInspectorClick(baseUrl, file, line, column)
      }
      componentInspector.onUpdated = () => {
        window.__NUXT_DEVTOOLS__?.componentInspectorUpdate({
          ...componentInspector.linkParams,
          ...componentInspector.position,
        })
      }
    }

    injection?.setClient({
      nuxt: nuxt as any,
      componentInspector,
      enableComponentInspector,
      getHooksMetrics() {
        return Object.values(clientHooks)
      },
    })
  }

  const button = h('button',
    {
      title: 'Open Nuxt DevTools',
      className: 'nuxt-devtools-toggle',
    },
    [
      h('img', {
        src: `${CLIENT_PATH}nuxt.svg`,
        style: {
          height: '20px',
          width: '20px',
          margin: 'auto',
        },
      }),
    ],
    el => el.addEventListener('click', toggle),
  )

  const style = h('style', {
    innerHTML: `
.nuxt-devtools-container {
  background: white;
  z-index: 2147483646;
}
.dark .nuxt-devtools-container {
  background: #0C0C0C;
}
.nuxt-devtools-toggle {
  position: fixed;
  bottom: -5px;
  left: calc(50% - 25px);
  background: #0C0C0C;
  border-radius: 100px 100px 0 0;
  border: 1px solid rgba(125,125,125,0.2);
  box-shadow: 3px 5px 10px rgba(0,0,0,0.1);
  z-index: 2147483647;
  height: 30px;
  width: 40px;
  cursor: pointer;
  title:flex;
  padding: 0;
  align-items: center;
  transition: all 0.2s ease-in-out;
}
.nuxt-devtools-button:hover {
  background: #1D1D1D;
  bottom: 0;
}
.nuxt-devtools-close-button {
  background: transparent;
  border: none;
}
.nuxt-devtools-button {
  padding: 0.25em 0.5em;
  border-radius: 0.25rem;
  border: 1px solid rgba(125,125,125,0.2);
}
.nuxt-devtools-button:hover {
  background: rgba(125,125,125,0.1);
}
`,
  })

  document.body.appendChild(button)
  document.head.appendChild(style)
})
