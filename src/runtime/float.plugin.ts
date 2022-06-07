import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (typeof document === 'undefined')
    return
  const CLIENT_PATH = '/__nuxt_devtools__/client/'

  const container = document.createElement('div')
  Object.assign(container.style, {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
  })

  const iframe = document.createElement('iframe')
  iframe.src = CLIENT_PATH
  Object.assign(iframe.style, {
    position: 'absolute',
    bottom: '60px',
    right: '0',
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
  Object.assign(button.style, {
    background: '#fff',
    borderRadius: '50%',
    border: '1px solid rgba(125,125,125,0.2)',
    boxShadow: '3px 5px 10px rgba(0,0,0,0.1)',
    zIndex: '9999',
    height: '50px',
    width: '50px',
    cursor: 'pointer',
    display: 'flex',
    padding: '0',
  })

  const logo = document.createElement('img')
  logo.src = `${CLIENT_PATH}nuxt.png`
  Object.assign(logo.style, {
    height: '30px',
    width: '30px',
    margin: 'auto',
  })

  button.addEventListener('click', () => {
    if (Array.from(container.children).includes(iframe)) {
      container.removeChild(iframe)
    }
    else {
      container.appendChild(iframe)
      iframe.contentDocument.body.parentElement.className = document.body.parentElement.className
    }
  })
  button.appendChild(logo)
  container.appendChild(button)
  document.body.appendChild(container)
})
