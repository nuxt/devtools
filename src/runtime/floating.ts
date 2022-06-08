import { stringify } from 'flatted'
import { defineNuxtPlugin } from '#app'

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

export default defineNuxtPlugin((nuxt) => {
  if (typeof document === 'undefined')
    return

  const CLIENT_PATH = '/__nuxt_devtools__/client/'
  const ENTRY_PATH = '/__nuxt_devtools__/entry/'

  nuxt.hook('page:finish', sendPayload)
  nuxt.hook('app:mounted', sendPayload)
  nuxt.hook('app:suspense:resolve', sendPayload)

  function sendPayload() {
    fetch(ENTRY_PATH, {
      method: 'POST',
      body: JSON.stringify({
        method: 'setPayload',
        data: stringify({
          url: location.pathname,
          time: Date.now(),
          ...nuxt.payload,
        }),
      }),
    })
  }

  const iframe = h('iframe', {
    src: CLIENT_PATH,
    className: 'nuxt-devtools-iframe',
    style: {
      height: '100%',
      width: '100%',
      borderRadius: '0.5rem',
      overflow: 'auto',
      outline: 'none',
      zIndex: '9999',
      border: '1px solid rgba(125,125,125,0.2)',
      boxShadow: '3px 5px 8px rgba(0,0,0,0.05)',
    },
  })

  const container = h('div', {
    style: {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      left: '10px',
      height: '600px',
      maxHeight: 'calc(100vh - 20px)',
      width: 'calc(100vw - 20px)',
    },
  },
  [
    iframe,
    // close button
    h('button', {
      innerHTML: '<svg aria-hidden="true" role="img" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path fill="currentColor" d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z"></path></svg>',
      className: 'nuxt-devtools-close-button',
      style: {
        position: 'absolute',
        top: '0',
        right: '0',
        padding: '5px',
      },
    }, [], el => el.addEventListener('click', toggle)),
  ])

  function toggle() {
    if (Array.from(document.body.children).includes(container)) {
      container.style.display = container.style.display === 'none' ? 'block' : 'none'
    }
    else {
      document.body.appendChild(container)
      iframe.contentDocument.body.parentElement.className = document.body.parentElement.className
    }
  }

  const button = h('button',
    {
      title: 'Open Nuxt DevTools',
      className: 'nuxt-devtools-button',
    },
    [
      h('img', {
        src: `${CLIENT_PATH}nuxt-invert.svg`,
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
.nuxt-devtools-button {
  position: fixed;
  bottom: -5px;
  left: calc(50% - 25px);
  background: #1DCC84;
  border-radius: 100px 100px 0 0;
  border: 1px solid rgba(125,125,125,0.2);
  box-shadow: 3px 5px 10px rgba(0,0,0,0.1);
  z-index: 999999;
  height: 30px;
  width: 40px;
  cursor: pointer;
  display: flex;
  padding: 0;
  align-items: center;
  transition: all 0.2s ease-in-out;
}
.nuxt-devtools-button:hover {
  background: #19af72;
  bottom: 0;
}
.nuxt-devtools-close-button {
  opacity: 0.5;
}
.nuxt-devtools-close-button:hover {
  opacity: 1;
}
`,
  })

  document.body.appendChild(button)
  document.head.appendChild(style)
})
