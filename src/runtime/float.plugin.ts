import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (typeof document === 'undefined')
    return
  const CLIENT_PATH = '/__nuxt_devtools__/client/'

  const iframe = document.createElement('iframe')
  iframe.src = CLIENT_PATH
  iframe.className = 'nuxt-devtools-iframe'
  Object.assign(iframe.style, {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    left: '10px',
    height: '400px',
    width: 'calc(100vw - 20px)',
    borderRadius: '10px',
    overflow: 'auto',
    outline: 'none',
    zIndex: '9999',
    border: '1px solid rgba(125,125,125,0.2)',
    boxShadow: '3px 5px 8px rgba(0,0,0,0.05)',
  })

  const button = document.createElement('button')
  button.title = 'Open Nuxt DevTools'
  button.className = 'nuxt-devtools-button'

  const style = document.createElement('style')
  style.innerHTML = `
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
`

  const logo = document.createElement('img')
  logo.src = `${CLIENT_PATH}nuxt-invert.svg`
  Object.assign(logo.style, {
    height: '20px',
    width: '20px',
    margin: 'auto',
  })

  button.addEventListener('click', () => {
    if (Array.from(document.body.children).includes(iframe)) {
      iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none'
    }
    else {
      document.body.appendChild(iframe)
      iframe.contentDocument.body.parentElement.className = document.body.parentElement.className
    }
  })
  button.appendChild(logo)
  document.body.appendChild(button)
  document.head.appendChild(style)
})
