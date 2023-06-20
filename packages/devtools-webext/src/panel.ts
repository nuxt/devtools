import browser from 'webextension-polyfill'

async function run() {
  const [result, isException] = await browser.devtools.inspectedWindow.eval('__NUXT_DEVTOOLS__')
  console.log({ result, isException })

  if (!result?.url)
    return noDevTools()

  // #1 - inline html
  // const origin = new URL(result.url).origin
  // const html = await fetch(result.url).then(res => res.text())
  // const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  //   ?.[1]
  //   ?.replace(/ src="\//, ` src="${origin}/`)

  // if (!body)
  //   return noDevTools()

  // const div = document.createElement('div')
  // div.innerHTML = body
  // document.body.appendChild(div)

  // #2 iframe
  const iframe = document.createElement('iframe')
  iframe.src = result.url
  iframe.style.border = 'none'
  iframe.style.outline = 'none'
  iframe.style.width = '100vw'
  iframe.style.height = '100vh'
  document.body.appendChild(iframe)

  // #3 - Import inline
  // const html = await fetch(result.url).then(res => res.text())
  // const elements = (new DOMParser().parseFromString(html, 'text/html')).body.children
  // const origin = new URL(result.url).origin

  // const div = document.createElement('div')
  // div.id = '__nuxt'
  // document.body.appendChild(div)

  // for (const element of elements) {
  //   if (element.tagName === 'SCRIPT') {
  //     if ('src' in element && element.src) {
  //       const url = new URL(element.src as string)
  //       import(origin + url.pathname)
  //     }
  //   }
  //   else {
  //     document.body.appendChild(element)
  //   }
  // }
}

function noDevTools() {
  const div = document.createElement('div')
  div.innerText = 'Nuxt devtools not found'
  document.body.appendChild(div)
}

run()
