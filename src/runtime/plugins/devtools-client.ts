import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import { computed, ref, watch, watchEffect } from 'vue'
import { setupHooksDebug } from '../shared/hooks'
import type { NuxtDevtoolsGlobal } from '../../types'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

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

const LAYOUT_IFRAME_SMALL = {
  position: 'fixed',
  bottom: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '300px',
  height: '60px',
  borderRadius: '0.5rem',
}

const PANEL_PADDING = 10
const PANEL_MIN = 5
const PANEL_MAX = 100

export default defineNuxtPlugin((nuxt) => {
  if (typeof document === 'undefined' || typeof window === 'undefined' || window.self !== window.top)
    return

  const CLIENT_PATH = '/__nuxt_devtools__/client/'
  // const ENTRY_PATH = '/__nuxt_devtools__/entry/'

  const clientHooks = setupHooksDebug(nuxt.hooks)

  // height and width of the panel, in percent
  const height = ref(+(localStorage.getItem('nuxt-devtools-height') || '50'))
  const width = ref(+(localStorage.getItem('nuxt-devtools-width') || '100'))
  width.value = Math.min(PANEL_MAX, Math.max(PANEL_MIN, width.value))
  height.value = Math.min(PANEL_MAX, Math.max(PANEL_MIN, height.value))

  const LAYOUT_IFRAME = computed(() => ({
    position: 'fixed',
    bottom: `${PANEL_PADDING}px`,
    borderRadius: '0.5rem',
    left: `calc(${(100 - width.value) / 2}vw + ${PANEL_PADDING}px)`,
    height: `calc(${height.value}vh - ${PANEL_PADDING * 2}px)`,
    width: `calc(${width.value}vw - ${PANEL_PADDING * 2}px)`,
  }))

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
  }, [], (iframe) => {
    iframe.addEventListener('load', async () => {
      await waitForClientInjection()
      setupClient()
    })
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

  // #region Resize
  const isDragging = ref<false | 'vertical' | 'horizontal' | 'both'>(false)
  const resizeHandleHorizontal = h('div', {
    className: 'nuxt-devtools-resize-handle nuxt-devtools-resize-handle-horizontal',
  }, [], (el) => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault()
      isDragging.value = 'horizontal'
    })
  })
  const resizeHandleVerticalLeft = h('div', {
    className: 'nuxt-devtools-resize-handle nuxt-devtools-resize-handle-vertical',
    style: {
      left: '0',
    },
  }, [], (el) => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault()
      isDragging.value = 'vertical'
    })
  })
  const resizeHandleVerticalRight = h('div', {
    className: 'nuxt-devtools-resize-handle nuxt-devtools-resize-handle-vertical',
    style: {
      right: '0',
    },
  }, [], (el) => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault()
      isDragging.value = 'vertical'
    })
  })
  const resizeHandleVerticalTopLeft = h('div', {
    className: 'nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner',
    style: {
      left: '0',
      cursor: 'nwse-resize',
    },
  }, [], (el) => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault()
      isDragging.value = 'both'
    })
  })
  const resizeHandleVerticalTopRight = h('div', {
    className: 'nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner',
    style: {
      right: '0',
      cursor: 'nesw-resize',
    },
  }, [], (el) => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault()
      isDragging.value = 'both'
    })
  })

  document.addEventListener('mousemove', (event) => {
    if (!isDragging.value)
      return

    if (isDragging.value === 'horizontal' || isDragging.value === 'both') {
      const fullHeight = window.innerHeight - PANEL_PADDING * 2
      const value = (window.innerHeight - event.clientY - PANEL_PADDING) / fullHeight * 100
      height.value = Math.min(PANEL_MAX, Math.max(PANEL_MIN, value))
    }

    if (isDragging.value === 'vertical' || isDragging.value === 'both') {
      const fullWidth = window.innerWidth - PANEL_PADDING * 2
      const halfPanelWidth = Math.abs(event.clientX - (window.innerWidth / 2)) - PANEL_PADDING
      const value = halfPanelWidth / fullWidth * 100 * 2
      width.value = Math.min(PANEL_MAX, Math.max(PANEL_MIN, value))
    }
  })
  document.addEventListener('mouseup', () => {
    isDragging.value = false
  })
  // #endregion

  const container = h('div', {
    className: 'nuxt-devtools-container',
    style: LAYOUT_IFRAME.value,
  },
  [
    iframe,
    closeButton,
    resizeHandleHorizontal,
    resizeHandleVerticalLeft,
    resizeHandleVerticalRight,
    resizeHandleVerticalTopLeft,
    resizeHandleVerticalTopRight,
  ])

  watchEffect(() => {
    localStorage.setItem('nuxt-devtools-height', height.value.toString())
    localStorage.setItem('nuxt-devtools-width', width.value.toString())
    if (!window.__VUE_INSPECTOR__?.enabled)
      Object.assign(container.style, LAYOUT_IFRAME.value)

    iframe.style.pointerEvents = isDragging.value ? 'none' : 'auto'
  })

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
    Object.assign(container.style, LAYOUT_IFRAME.value)
    window.__NUXT_DEVTOOLS__?.componentInspectorClose()
  }

  function waitForClientInjection(retry = 10, timeout = 200) {
    const test = () => !!iframe?.contentWindow?.__NUXT_DEVTOOLS__

    if (test())
      return

    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(() => {
        if (test()) {
          clearInterval(interval)
          resolve()
        }
        else if (retry-- <= 0) {
          clearInterval(interval)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Nuxt Devtools client injection failed')
        }
      }, timeout)
    })
  }

  function setupClient() {
    // trigger update for payload change
    watch(nuxt.payload, () => {
      iframe?.contentWindow?.__NUXT_DEVTOOLS__?.triggerUpdate()
    }, { deep: true })

    // trigger update for route change
    nuxt.vueApp.config.globalProperties?.$router?.afterEach(() => {
      iframe?.contentWindow?.__NUXT_DEVTOOLS__?.triggerUpdate()
    })

    updateClient()
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
.nuxt-devtools-resize-handle-horizontal {
  position: absolute;
  top: 0;
  left: 6px;
  right: 6px;
  height: 10px;
  margin: -5px 0;
  cursor: ns-resize;
  border-radius: 5px;
}
.nuxt-devtools-resize-handle-vertical {
  position: absolute;
  top: 6px;
  bottom: 0;
  width: 10px;
  margin: 0 -5px;
  cursor: ew-resize;
  border-radius: 5px;
}
.nuxt-devtools-resize-handle-corner {
  position: absolute;
  top: 0;
  width: 14px;
  height: 14px;
  margin: -6px;
  border-radius: 6px;
}
.nuxt-devtools-resize-handle:hover {
  background: rgba(125,125,125,0.1);
}
`,
  })

  document.body.appendChild(button)
  document.head.appendChild(style)

  // for development
  if (useRuntimeConfig().public.NUXT_DEVTOOLS_OPEN)
    toggle()
})
