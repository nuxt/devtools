// Copy the generated client SPA into the `@nuxt/devtools-assets` package and
// make it mount-path portable, so devframe can serve the directory verbatim
// at any base (a local install, the on-disk cache, or its CDN back-proxy) —
// see https://devfra.me/guide/client-assets.html.
import { cpSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SOURCE = 'client/.output/public'
const TARGET = '../devtools-assets/dist'

// The client is generated with the `/__NUXT_DEVTOOLS_BASE__/` placeholder as
// its base URL (see `client/nuxt.config.ts` — Nuxt cannot generate with a
// relative base directly). Rewrite each HTML shell so it works at any mount
// point:
//
// 1. The inline runtime config's `baseURL` becomes a `location`-derived
//    expression. The client uses hash routing in production, so
//    `location.pathname` is always the mount path (possibly ending in
//    `index.html`, hence stripping the trailing filename).
// 2. Every other placeholder occurrence (asset `href`/`src`, importmap)
//    becomes `./`, relative to the document — which, per 1., is always the
//    mount root.
const PLACEHOLDER = '/__NUXT_DEVTOOLS_BASE__/'
const RUNTIME_CONFIG_BASE_RE = /baseURL:"\/__NUXT_DEVTOOLS_BASE__\/"/
const RUNTIME_CONFIG_BASE_REPLACEMENT = 'baseURL:location.pathname.replace(/[^/]*$/,"")'

rmSync(TARGET, { recursive: true, force: true })
cpSync(SOURCE, TARGET, { recursive: true })

const htmlFiles = readdirSync(TARGET).filter(file => file.endsWith('.html'))
if (htmlFiles.length === 0)
  throw new Error(`No HTML shell found in ${TARGET} — did \`nuxi generate client\` run?`)

for (const file of htmlFiles) {
  const path = join(TARGET, file)
  let html = readFileSync(path, 'utf-8')
  if (!RUNTIME_CONFIG_BASE_RE.test(html))
    throw new Error(`Expected the inline runtime-config \`baseURL:"${PLACEHOLDER}"\` in ${file} — Nuxt's serialization may have changed; update copy-client.mjs.`)
  // Order matters: rewrite the runtime-config occurrence first, then the
  // remaining (asset URL) occurrences.
  html = html.replace(RUNTIME_CONFIG_BASE_RE, RUNTIME_CONFIG_BASE_REPLACEMENT)
  html = html.replaceAll(PLACEHOLDER, './')
  writeFileSync(path, html)
}
