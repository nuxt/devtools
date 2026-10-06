import type { NuxtOptions } from '@nuxt/schema'
import { fileURLToPath } from 'node:url'
import { createOnboarding } from '@devframes/hub-ui-onboard'
import { defineNuxtModule, installModule, tryResolveModule } from '@nuxt/kit'
import { readPackageJSON } from 'pkg-types'

const DEVTOOLS = '@nuxt/devtools'

/** The names Nuxt itself recognizes as DevTools in `modules` (see `loadNuxt` in nuxt core). */
const DEVTOOLS_MODULES = new Set([DEVTOOLS, `${DEVTOOLS}-nightly`, `${DEVTOOLS}-edge`])

function listsDevtools(modules: NuxtOptions['modules']): boolean {
  return modules.some((entry) => {
    const id = Array.isArray(entry) ? entry[0] : entry
    return typeof id === 'string' && DEVTOOLS_MODULES.has(id)
  })
}

/**
 * The spec the button installs. Versions are released in lockstep, so a caret
 * on our own version pins the matching DevTools; a nightly build carries an
 * `npm:@nuxt/devtools-nightly@…` alias in its peer range instead.
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

    const installed = await tryResolveModule(DEVTOOLS, nuxt.options.modulesDir)
    if (installed)
      return installModule(installed)
    if (!nuxt.options.dev)
      return

    const onboarding = createOnboarding({
      cwd: nuxt.options.rootDir,
      // Where Vite DevTools mounts the hub, so after the restart the real
      // `embedded.js` answers at the URL the button was loaded from.
      base: '/__devtools/',
      packages: [await devtoolsSpec()],
      branding: {
        productName: 'Nuxt DevTools',
        primaryColor: '#099e61',
        logo: 'https://nuxt.com/assets/design-kit/icon-green.svg',
      },
      messages: {
        restart: 'Installed. Restarting the dev server…',
      },
      onInstalled() {
        // A Nuxt module only mounts during setup, so the dev server has to
        // start over. Delay past the install response so the panel can show
        // the restart message before the process goes away.
        setTimeout(() => nuxt.callHook('restart', { hard: true }), 100)
      },
    })

    nuxt.hook('vite:serverCreated', (server, { isClient }) => {
      if (isClient)
        server.middlewares.use(onboarding.nodeMiddleware)
    })
    if (!onboarding.disabled)
      (nuxt.options.app.head.script ??= []).push({ type: 'module', src: onboarding.scriptSrc, tagPosition: 'bodyClose' })
  },
})
