import { createApp, useQuery } from '@nuxt/h2'
import { listen } from 'listhen'
import { createProxyServer } from 'http-proxy'
import { $fetch } from 'ohmyfetch/node'
import edge from 'edge.js'
import { readFileSync } from 'fs'
import execa from 'execa'

async function readData(lang = 'en') {
  const data = {
    debug: false
  }
  data.messages = JSON.parse(readFileSync(`data/${lang}/messages.json`, 'utf-8'))

  return data
}
async function main () {
  const name = process.argv[2] || '500';
  const file = `src/${name}.html`
  console.info('Serving in development:', file)
  const parcel = execa('parcel', [ 'dev', file ])
  parcel.stdout.pipe(process.stdout)
  parcel.stderr.pipe(process.stderr)

  const app = createApp()
  const proxy = createProxyServer({})

  const parcelURL = 'http://localhost:1234/'

  app.use(async (req) => {
    if (req.url !== "/") {
      return
    }
    try {
      const html = await $fetch(parcelURL)
      const { lang } = useQuery(req)
      const data = await readData(lang)

      return edge.renderString(html, data)
    } catch (err) {
      console.error(err)
      return err.data ? err.data : err
    }
  })
    
  app.use((req, res) => {
    proxy.web(req, res, { target: parcelURL })
  })

  await listen(app)
}

main().catch(err => {
  console.error(err)
  process.exit(0)
})