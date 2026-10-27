import type { NuxtOptions } from '@nuxt/schema'
import { fileURLToPath } from 'node:url'
import { createOnboarding } from '@devframes/hub-ui-onboard'
import { defineNuxtModule, installModule, logger, tryResolveModule } from '@nuxt/kit'
import { readPackageJSON } from 'pkg-types'
import { confirmInTerminal } from './terminal-confirm'

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

/**
 * Where Vite DevTools mounts the hub, so after the restart the real
 * `embedded.js` answers at the URL the button was loaded from.
 */
const BASE = '/__devtools/'

function listsDevtools(modules: NuxtOptions['modules']): boolean {
  return modules.some((entry) => {
    const id = Array.isArray(entry)
      ? entry[0]
      : entry
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
  return `${DEVTOOLS}@${range.startsWith('npm:')
    ? range
    : `^${version}`}`
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
        restart: 'Installed. Restarting the dev server…',
      },
      // Upstream's own question refuses at once under nuxi's TUI (DF9007).
      onConfirm: ({ command }) => confirmInTerminal(command, {
        ask: message => logger.box(message),
        warn: message => logger.warn(message),
      }),
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
      // Nuxt only hands a request to Vite when a middleware is mounted on a
      // path other than `/`; otherwise it rewrites the URL to `/__skip_vite/…`.
      // Connect strips the mount path, so restore the full URL the
      // middleware matches against `base`.
      server.middlewares.use(BASE.slice(0, -1), (req, res, next) => {
        req.url = req.originalUrl || req.url
        onboarding.nodeMiddleware(req, res, next)
      })
    })
    if (!onboarding.disabled)
      (nuxt.options.app.head.script ??= []).push({ type: 'module', src: onboarding.scriptSrc, tagPosition: 'bodyClose' })
  },
})
