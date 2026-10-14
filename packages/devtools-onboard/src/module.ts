import type { NuxtOptions } from '@nuxt/schema'
import { fileURLToPath } from 'node:url'
import { createOnboarding } from '@devframes/hub-ui-onboard'
import { defineNuxtModule, installModule, tryResolveModule } from '@nuxt/kit'
import { readPackageJSON } from 'pkg-types'
import { fromThisMachine } from './this-machine'

/** Where Vite DevTools mounts the hub, so after the restart the real `embedded.js` answers at the URL the button was loaded from. */
const BASE = '/__devtools/'

const DEVTOOLS = '@nuxt/devtools'
const DEVTOOLS_NIGHTLY = `${DEVTOOLS}-nightly`

/** The names Nuxt itself recognizes as DevTools in `modules` (see `loadNuxt` in nuxt core). */
const DEVTOOLS_MODULES = new Set([DEVTOOLS, DEVTOOLS_NIGHTLY, `${DEVTOOLS}-edge`])

/**
 * The packages loaded when installed, any major. A nightly under its own name
 * is always a deliberate opt-in, while `@nuxt/devtools` may come along with
 * another dependency, so the nightly wins.
 */
const DEVTOOLS_PACKAGES = [DEVTOOLS_NIGHTLY, DEVTOOLS]

function listsDevtools(modules: NuxtOptions['modules']): boolean {
  return modules.some((entry) => {
    const id = Array.isArray(entry) ? entry[0] : entry
    return typeof id === 'string' && DEVTOOLS_MODULES.has(id)
  })
}

/**
 * The spec the button installs. Versions are released in lockstep, so a caret
 * on our own version pins the matching DevTools; a nightly build carries an
 * `npm:@nuxt/devtools-nightly@…` alias in its peer range instead. Otherwise
 * the peer range is `*`: it must not conflict with an installed v3 or nightly,
 * and npm only matches prereleases against `*`.
 */
async function devtoolsSpec(): Promise<string> {
  const { version, peerDependencies } = await readPackageJSON(fileURLToPath(import.meta.url))
  const range = peerDependencies?.[DEVTOOLS] ?? ''
  return `${DEVTOOLS}@${range.startsWith('npm:') ? range : `^${version}`}`
}

export default defineNuxtModule({
  meta: {
    name: '@nuxt/devtools-onboard',
  },
  async setup(_, nuxt) {
    const { devtools } = nuxt.options
    if (devtools === false || (typeof devtools === 'object' && devtools.enabled === false))
      return
    if (listsDevtools(nuxt.options.modules))
      return

    for (const name of DEVTOOLS_PACKAGES) {
      const installed = await tryResolveModule(name, nuxt.options.modulesDir)
      if (installed)
        return installModule(installed)
    }
    if (!nuxt.options.dev)
      return

    const onboarding = createOnboarding({
      cwd: nuxt.options.rootDir,
      base: BASE,
      packages: [await devtoolsSpec()],
      branding: {
        productName: 'Nuxt DevTools',
        primaryColor: '#099e61',
        logo: 'https://nuxt.com/assets/design-kit/icon-green.svg',
      },
      messages: {
        confirming: 'Installing…',
        refused: 'Install from a browser on the machine that runs nuxt dev, or run the command above yourself.',
        restart: 'Installed. Restarting the dev server…',
      },
      // The middleware below refuses other devices, so a click from this
      // machine is the developer's consent. The default y/N prompt reads
      // stdin, which nuxi keeps for its own shortcuts and TUI.
      onConfirm: () => true,
      onInstalled() {
        // A Nuxt module only mounts during setup, so the dev server has to
        // start over. Delay past the install response so the panel can show
        // the restart message before the process goes away.
        setTimeout(() => nuxt.callHook('restart', { hard: true }), 100)
      },
    })

    nuxt.hook('vite:serverCreated', (server, { isClient }) => {
      if (!isClient)
        return
      server.middlewares.use((req, res, next) => {
        // Same prefix test as `nodeMiddleware`, so no spelling of its POST routes slips past.
        if (req.method !== 'GET' && req.method !== 'HEAD' && req.url?.startsWith(BASE) && !fromThisMachine(req)) {
          res.statusCode = 403
          res.end()
          return
        }
        onboarding.nodeMiddleware(req, res, next)
      })
    })
    if (!onboarding.disabled)
      (nuxt.options.app.head.script ??= []).push({ type: 'module', src: onboarding.scriptSrc, tagPosition: 'bodyClose' })
  },
})
