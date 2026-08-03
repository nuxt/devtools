import { defineNuxtModule, installModule } from '@nuxt/kit'
import piniaModule from '@pinia/nuxt'

/**
 * `@pinia/nuxt@1.0.1` declares `compatibility: { nuxt: '^3.15.0 || ^4.0.0' }`
 * (see its `dist/module.mjs`), which predates Nuxt 5 and isn't satisfied by
 * `nuxt-nightly@5x` — so Nuxt silently disables the module (`NUXT_B8013`)
 * instead of running its `setup()`. Nothing in that `setup()` actually
 * depends on Nuxt-4-only internals (it just registers a plugin, wires up
 * `useState`-backed SSR hydration, and adds auto-imports), so this loosens
 * the stale version gate before installing it for real, rather than
 * patching the package or forking the compatibility check.
 *
 * `getMeta()` returns the module's live `meta` object (a stable `@nuxt/kit`
 * module contract), so mutating it here is visible to the same closure
 * `installModule` calls into. Drop this once `@pinia/nuxt` ships a release
 * whose `compatibility.nuxt` range includes 5.x.
 */
export default defineNuxtModule({
  meta: {
    name: 'pinia-nuxt5-compat',
  },
  async setup(_options, nuxt) {
    const meta = await piniaModule.getMeta!()
    meta.compatibility = {}
    await installModule(piniaModule, nuxt.options.pinia)
  },
})
