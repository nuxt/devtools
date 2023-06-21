/* eslint-disable eslint-comments/no-unlimited-disable */
import browser from 'webextension-polyfill'

async function run() {
  const [url, isException] = await browser.devtools.inspectedWindow.eval('window.__NUXT_DEVTOOLS_URL__')
  // eslint-disable-next-line no-console
  console.log({ url, isException })

  if (!url)
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
  // const iframe = document.createElement('iframe')
  // iframe.src = url
  // iframe.style.border = 'none'
  // iframe.style.outline = 'none'
  // iframe.style.width = '100vw'
  // iframe.style.height = '100vh'
  // document.body.appendChild(iframe)

  // #3 - Import inline
  const html = await fetch(url).then(res => res.text())
  const elements = Array.from((new DOMParser().parseFromString(html, 'text/html')).body.children)
  const origin = new URL(url).origin

  const div = document.createElement('div')
  div.id = '__nuxt'
  document.body.appendChild(div)

  setupColorMode()
  window.__NUXT_DEVTOOLS_SERVER_ORIGIN__ = origin
  window.__NUXT__ ||= {}
  window.__NUXT__.config = { public: { }, app: { baseURL: '/__nuxt_devtools__/client', buildAssetsDir: '/_nuxt/', cdnURL: '' } }

  window.history.replaceState('', '', window.__NUXT__.config.app.baseURL)

  for (const element of elements) {
    if (element.tagName === 'SCRIPT') {
      if ('src' in element && element.src) {
        const url = new URL(element.src as string)
        await import(origin + url.pathname)
      }
      else {
        // Manifest V3 does not support eval, we might need to workaround this later
        // const script = document.createElement('script')
        // script.innerHTML = element.innerHTML
        // document.body.appendChild(script)
      }
    }
    else {
      div.appendChild(element)
    }
  }
}

function noDevTools() {
  const div = document.createElement('div')
  div.innerText = 'Nuxt devtools not found'
  document.body.appendChild(div)
}

function setupColorMode() {
  /* eslint-disable */
  // @ts-expect-error cast
  const w=window,de=document.documentElement,knownColorSchemes=["dark","light"],preference=window.localStorage.getItem("nuxt-color-mode")||"system";let value=preference==="system"?getColorScheme():preference;const forcedColorMode=de.getAttribute("data-color-mode-forced");forcedColorMode&&(value=forcedColorMode),addColorScheme(value),w["__NUXT_COLOR_MODE__"]={preference,value,getColorScheme,addColorScheme,removeColorScheme};function addColorScheme(e){const o=""+e+"",t="";de.classList?de.classList.add(o):de.className+=" "+o,t&&de.setAttribute("data-"+t,e)}function removeColorScheme(e){const o=""+e+"",t="";de.classList?de.classList.remove(o):de.className=de.className.replace(new RegExp(o,"g"),""),t&&de.removeAttribute("data-"+t)}function prefersColorScheme(e){return w.matchMedia("(prefers-color-scheme"+e+")")}function getColorScheme(){if(w.matchMedia&&prefersColorScheme("").media!=="not all"){for(const e of knownColorSchemes)if(prefersColorScheme(":"+e).matches)return e}return"light"}
  /* eslint-enable */
}

run()
