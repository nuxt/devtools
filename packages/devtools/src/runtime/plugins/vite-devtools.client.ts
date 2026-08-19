import { DEVTOOLS_MOUNT_PATH } from '@vitejs/devtools-kit/constants'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(() => {
  // Vite DevTools 0.5 no longer exposes an importable `@vitejs/devtools/client/inject`
  // entry; its embedded overlay client now ships as `@devframes/hub-ui` and is
  // served by the hub at `<mount>/embedded.js`. Load it the same way the upstream
  // `DevToolsInjection` Vite plugin does — a runtime-created module script, rather
  // than a bundler `import()`, so the hub-served URL stays out of Vite's module
  // graph and its `import.meta.url`-relative asset fetches (e.g. `branding.json`)
  // resolve against the real served URL.
  const script = document.createElement('script')
  script.type = 'module'
  script.src = `${DEVTOOLS_MOUNT_PATH}embedded.js`
  document.body.appendChild(script)
})
